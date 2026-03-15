(function initRecognitionCoreModule(root) {
  "use strict";

  const DEFAULT_CONFIG = Object.freeze({
    version: "v2",
    retryBand: 0.05,
    mlBlendWeight: 0.26,
    mlFallback: Object.freeze({ minMl: 0.93, minBase: 0.5 }),
    tiers: Object.freeze({
      simple: Object.freeze({
        weights: Object.freeze({ overlap: 0.56, projection: 0.26, grid: 0.18 }),
        passThreshold: 0.63
      }),
      medium: Object.freeze({
        weights: Object.freeze({ overlap: 0.52, projection: 0.28, grid: 0.2 }),
        passThreshold: 0.61
      }),
      complex: Object.freeze({
        weights: Object.freeze({ overlap: 0.46, projection: 0.3, grid: 0.24 }),
        passThreshold: 0.59
      })
    })
  });

  function toFiniteNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function clampUnit(value) {
    return Math.max(0, Math.min(1, toFiniteNumber(value, 0)));
  }

  function percentileSorted(sortedValues, percentile) {
    if (!Array.isArray(sortedValues) || sortedValues.length === 0) return 0;
    const p = Math.max(0, Math.min(1, toFiniteNumber(percentile, 0.5)));
    const index = (sortedValues.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const ratio = index - lower;
    const lowerV = toFiniteNumber(sortedValues[lower], 0);
    const upperV = toFiniteNumber(sortedValues[upper], lowerV);
    return lowerV + (upperV - lowerV) * ratio;
  }

  function computeQuantileThresholds(values, lowPercentile = 0.33, highPercentile = 0.66) {
    const cleaned = Array.isArray(values)
      ? values
          .map((x) => toFiniteNumber(x, NaN))
          .filter((x) => Number.isFinite(x) && x >= 0)
          .sort((a, b) => a - b)
      : [];
    if (!cleaned.length) {
      return { low: 0, high: 0, sampleSize: 0 };
    }
    const low = percentileSorted(cleaned, lowPercentile);
    const high = percentileSorted(cleaned, highPercentile);
    return {
      low,
      high: Math.max(low, high),
      sampleSize: cleaned.length
    };
  }

  function resolveTier(activeBits, quantiles) {
    const bits = Math.max(0, toFiniteNumber(activeBits, 0));
    const low = quantiles && Number.isFinite(quantiles.low) ? Number(quantiles.low) : 0;
    const high = quantiles && Number.isFinite(quantiles.high) ? Number(quantiles.high) : low;
    if (bits <= low) return "simple";
    if (bits <= high) return "medium";
    return "complex";
  }

  function resolveTierProfile(tier, config = DEFAULT_CONFIG) {
    const tiers = (config && config.tiers) || DEFAULT_CONFIG.tiers;
    if (tier === "simple" && tiers.simple) return tiers.simple;
    if (tier === "complex" && tiers.complex) return tiers.complex;
    return tiers.medium || DEFAULT_CONFIG.tiers.medium;
  }

  function combineEngineScores(engines, profile) {
    const weights = (profile && profile.weights) || DEFAULT_CONFIG.tiers.medium.weights;
    const overlap = clampUnit(engines && engines.overlap);
    const projection = clampUnit(engines && engines.projection);
    const grid = clampUnit(engines && engines.grid);
    const score =
      overlap * toFiniteNumber(weights.overlap, 0) +
      projection * toFiniteNumber(weights.projection, 0) +
      grid * toFiniteNumber(weights.grid, 0);
    return clampUnit(score);
  }

  function blendMlScore(baseScore, mlScore, config = DEFAULT_CONFIG) {
    const base = clampUnit(baseScore);
    const ml = Number.isFinite(mlScore) ? clampUnit(mlScore) : null;
    if (ml === null) {
      return { blended: base, ml: null };
    }
    const w = Math.max(0, Math.min(1, toFiniteNumber(config && config.mlBlendWeight, DEFAULT_CONFIG.mlBlendWeight)));
    return {
      blended: clampUnit((1 - w) * base + w * ml),
      ml
    };
  }

  function normalizeOcrResult(input) {
    const confidence = Number.isFinite(input && input.confidence) ? clampUnit(input.confidence) : 0;
    const text = String((input && input.text) || "");
    const expectedText = String((input && input.expectedText) || "");
    const available = input && input.available !== undefined ? Boolean(input.available) : Boolean(text || confidence > 0);
    const applied = Boolean(input && input.applied !== false && available);
    return {
      applied,
      available,
      match: Boolean(input && input.match),
      text,
      expectedText,
      confidence,
      variant: String((input && input.variant) || ""),
      model: String((input && input.model) || ""),
      provider: String((input && input.provider) || ""),
      source: String((input && input.source) || "")
    };
  }

  function decideRecognition(input, config = DEFAULT_CONFIG) {
    const tier = String((input && input.tier) || "medium");
    const retryAttempt = Math.max(0, Math.floor(toFiniteNumber(input && input.retryAttempt, 0)));
    const profile = resolveTierProfile(tier, config);
    const passThreshold = clampUnit(profile && profile.passThreshold);
    const retryLow = clampUnit(passThreshold - Math.max(0, toFiniteNumber(config && config.retryBand, DEFAULT_CONFIG.retryBand)));

    const engines = {
      overlap: clampUnit(input && input.engines && input.engines.overlap),
      projection: clampUnit(input && input.engines && input.engines.projection),
      grid: clampUnit(input && input.engines && input.engines.grid)
    };

    const baseScore = combineEngineScores(engines, profile);
    const mlScoreRaw = Number.isFinite(input && input.mlScore) ? Number(input.mlScore) : null;
    const blend = blendMlScore(baseScore, mlScoreRaw, config);
    const decisionScore = blend.blended;

    const mlFallback = (config && config.mlFallback) || DEFAULT_CONFIG.mlFallback;
    const hasMl = Number.isFinite(blend.ml);
    const passByThreshold = decisionScore >= passThreshold;
    const passByMlFallback =
      hasMl &&
      blend.ml >= clampUnit(mlFallback.minMl) &&
      baseScore >= clampUnit(mlFallback.minBase);

    let decision = "fail";
    let reason = "below_threshold";

    if (passByThreshold || passByMlFallback) {
      decision = "pass";
      reason = passByThreshold ? "pass_threshold" : "pass_ml_fallback";
    } else if (decisionScore >= retryLow && retryAttempt < 1) {
      decision = "retry";
      reason = "uncertain_retry";
    } else if (decisionScore >= retryLow && retryAttempt >= 1) {
      decision = "fail";
      reason = "uncertain_exhausted";
    }

    return {
      version: String((config && config.version) || DEFAULT_CONFIG.version),
      decision,
      decisionScore,
      baseScore,
      mlScore: hasMl ? blend.ml : null,
      blendedScore: decisionScore,
      tier,
      thresholds: {
        pass: passThreshold,
        retryLow
      },
      engines,
      retryAttempt,
      reason
    };
  }

  function decideRecognitionWithOcr(detail, ocrInput) {
    const base = detail && typeof detail === "object" ? { ...detail } : decideRecognition({});
    const ocr = normalizeOcrResult(ocrInput);
    const merged = {
      ...base,
      version: ocr.applied ? "v3" : String(base.version || DEFAULT_CONFIG.version),
      ocr: ocr.applied ? ocr : null
    };

    if (!ocr.applied || !ocr.match) return merged;

    const decisionScore = clampUnit(base.decisionScore);
    const assistedPass = ocr.confidence >= 0.5 || (base.decision === "retry" && ocr.confidence >= 0.35);
    if (!assistedPass) return merged;

    const boostedScore = clampUnit(Math.max(decisionScore, 0.62 + ocr.confidence * 0.24));
    merged.decision = "pass";
    merged.decisionScore = boostedScore;
    merged.blendedScore = boostedScore;
    merged.reason = base.decision === "pass" ? "pass_threshold_ocr_confirmed" : "pass_ocr_match";
    return merged;
  }

  function isMlUpdateEligible(detail) {
    if (!detail || detail.decision !== "pass") return false;
    const pass = clampUnit(detail.thresholds && detail.thresholds.pass);
    const score = clampUnit(detail.decisionScore);
    return score >= pass + 0.02;
  }

  function mergeRetryWordResults(previousResults, pendingIndexes, retryResults) {
    const merged = Array.isArray(previousResults) ? previousResults.map((x) => (x ? { ...x } : x)) : [];
    const pendingSet = new Set(Array.isArray(pendingIndexes) ? pendingIndexes.filter((x) => Number.isInteger(x) && x >= 0) : []);
    if (!pendingSet.size) return merged;

    const updates = new Map();
    if (Array.isArray(retryResults)) {
      retryResults.forEach((item) => {
        if (!item || !Number.isInteger(item.index)) return;
        updates.set(item.index, { ...item });
      });
    }

    pendingSet.forEach((index) => {
      if (updates.has(index)) merged[index] = updates.get(index);
    });

    return merged;
  }

  const api = {
    DEFAULT_CONFIG,
    computeQuantileThresholds,
    resolveTier,
    resolveTierProfile,
    combineEngineScores,
    blendMlScore,
    normalizeOcrResult,
    decideRecognition,
    decideRecognitionWithOcr,
    isMlUpdateEligible,
    mergeRetryWordResults
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.RecognitionCore = api;
})(typeof window !== "undefined" ? window : globalThis);

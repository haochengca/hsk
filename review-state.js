(function initReviewStateModule(root) {
  const FLOW = {
    IDLE: "idle",
    PREVIEW: "preview",
    ANSWERING: "answering",
    REVIEWED: "reviewed",
    ENDED: "ended"
  };

  function toFlow(value) {
    const normalized = String(value || "").toLowerCase();
    if (Object.values(FLOW).includes(normalized)) return normalized;
    return FLOW.IDLE;
  }

  function getReviewFlowContext(context) {
    const total = Number(context && context.total ? context.total : 0) || 0;
    const index = Number(context && context.index ? context.index : 0) || 0;
    const flow = toFlow(context && context.flow);
    const hasItem = total > 0 && index >= 0 && index < total;
    const isLastItem = hasItem && index === total - 1;

    const canBegin = flow === FLOW.IDLE || flow === FLOW.ENDED;
    const canRestart = flow === FLOW.ANSWERING || flow === FLOW.REVIEWED;
    const canJudge = flow === FLOW.ANSWERING && hasItem;
    const canReset = flow === FLOW.ANSWERING && hasItem;
    const canStop = flow === FLOW.ANSWERING || flow === FLOW.REVIEWED || flow === FLOW.PREVIEW;
    const canNext = flow === FLOW.REVIEWED && hasItem && !isLastItem;

    const showStop = canStop && !isLastItem;
    const showNext = flow === FLOW.REVIEWED && hasItem && !isLastItem;

    return {
      flow,
      hasItem,
      isLastItem,
      canBegin,
      canRestart,
      canJudge,
      canReset,
      canStop,
      canNext,
      showStop,
      showNext
    };
  }

  const api = {
    FLOW,
    toFlow,
    getReviewFlowContext
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.ReviewState = api;
})(typeof window !== "undefined" ? window : globalThis);

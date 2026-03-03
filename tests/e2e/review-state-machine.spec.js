const assert = require('assert');
const { FLOW, getReviewFlowContext } = require('../../review-state.js');

function testIdleState() {
  const ctx = getReviewFlowContext({ flow: FLOW.IDLE, total: 0, index: 0 });
  assert.equal(ctx.canBegin, true);
  assert.equal(ctx.canRestart, false);
  assert.equal(ctx.showNext, false);
}

function testAnsweringMiddleItem() {
  const ctx = getReviewFlowContext({ flow: FLOW.ANSWERING, total: 5, index: 1 });
  assert.equal(ctx.canJudge, true);
  assert.equal(ctx.canReset, true);
  assert.equal(ctx.showStop, true);
  assert.equal(ctx.showNext, false);
}

function testReviewedMiddleItem() {
  const ctx = getReviewFlowContext({ flow: FLOW.REVIEWED, total: 5, index: 2 });
  assert.equal(ctx.canNext, true);
  assert.equal(ctx.showNext, true);
  assert.equal(ctx.canJudge, false);
}

function testLastItemRule() {
  const ctxAnswering = getReviewFlowContext({ flow: FLOW.ANSWERING, total: 3, index: 2 });
  const ctxReviewed = getReviewFlowContext({ flow: FLOW.REVIEWED, total: 3, index: 2 });
  assert.equal(ctxAnswering.isLastItem, true);
  assert.equal(ctxAnswering.showStop, false);
  assert.equal(ctxReviewed.showNext, false);
}

function testPreviewState() {
  const ctx = getReviewFlowContext({ flow: FLOW.PREVIEW, total: 10, index: 0 });
  assert.equal(ctx.canStop, true);
  assert.equal(ctx.canJudge, false);
  assert.equal(ctx.canNext, false);
}

testIdleState();
testAnsweringMiddleItem();
testReviewedMiddleItem();
testLastItemRule();
testPreviewState();

console.log('review-state-machine.spec.js passed');

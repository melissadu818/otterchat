import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertMessageReactionInput,
  setMessageReactions,
  summarizeReactions,
  toggleReactionInList,
} from "../lib/chat/reactions.ts";

describe("toggleReactionInList", () => {
  it("adds a missing reaction and removes an existing one", () => {
    const added = toggleReactionInList([], { emoji: "👍", userId: "a" });

    assert.deepEqual(added, [{ emoji: "👍", userId: "a" }]);
    assert.deepEqual(toggleReactionInList(added, { emoji: "👍", userId: "a" }), []);
  });

  it("only removes the matching user's reaction", () => {
    const reactions = [
      { emoji: "👍", userId: "a" },
      { emoji: "👍", userId: "b" },
    ];

    assert.deepEqual(toggleReactionInList(reactions, { emoji: "👍", userId: "a" }), [
      { emoji: "👍", userId: "b" },
    ]);
  });
});

describe("setMessageReactions", () => {
  it("drops the message key when it has no reactions left", () => {
    const map = { m1: [{ emoji: "🎉", userId: "a" }] };

    assert.deepEqual(setMessageReactions(map, "m1", []), {});
    const empty = {};

    assert.equal(setMessageReactions(empty, "m1", []), empty);
  });
});

describe("summarizeReactions", () => {
  it("counts per emoji and flags the viewer's own reactions", () => {
    const summaries = summarizeReactions(
      [
        { emoji: "👍", userId: "a" },
        { emoji: "👍", userId: "b" },
        { emoji: "❤️", userId: "b" },
      ],
      "a",
    );

    assert.deepEqual(summaries, [
      { count: 2, emoji: "👍", reactedByViewer: true },
      { count: 1, emoji: "❤️", reactedByViewer: false },
    ]);
  });
});

describe("assertMessageReactionInput", () => {
  it("rejects emoji outside the fixed set and empty message ids", () => {
    assert.doesNotThrow(() => assertMessageReactionInput({ emoji: "😮", messageId: "m1" }));
    assert.throws(() => assertMessageReactionInput({ emoji: "💩", messageId: "m1" }));
    assert.throws(() => assertMessageReactionInput({ emoji: "👍", messageId: "" }));
  });
});

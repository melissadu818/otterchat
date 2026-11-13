import type { MessageReaction, MessageReactionMap } from "@/lib/chat/types";

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "😮"] as const;

export const ANONYMOUS_REACTION_USER_ID = "anonymous";

const MAX_MESSAGE_ID_LENGTH = 256;

export function isReactionEmoji(value: string): boolean {
  return (REACTION_EMOJIS as readonly string[]).includes(value);
}

export function assertMessageReactionInput(input: {
  readonly emoji: string;
  readonly messageId: string;
}) {
  if (!isReactionEmoji(input.emoji)) {
    throw new Error("Unsupported reaction.");
  }

  if (!input.messageId || input.messageId.length > MAX_MESSAGE_ID_LENGTH) {
    throw new Error("Invalid message.");
  }
}

export function toggleReactionInList(
  reactions: readonly MessageReaction[],
  { emoji, userId }: MessageReaction,
): MessageReaction[] {
  const exists = reactions.some(
    (reaction) => reaction.emoji === emoji && reaction.userId === userId,
  );

  return exists
    ? reactions.filter((reaction) => !(reaction.emoji === emoji && reaction.userId === userId))
    : [...reactions, { emoji, userId }];
}

export function setMessageReactions(
  map: MessageReactionMap,
  messageId: string,
  reactions: readonly MessageReaction[],
): MessageReactionMap {
  if (reactions.length > 0) {
    return { ...map, [messageId]: reactions };
  }

  if (!(messageId in map)) {
    return map;
  }

  const { [messageId]: _removed, ...rest } = map;

  return rest;
}

export type ReactionSummary = {
  readonly count: number;
  readonly emoji: string;
  readonly reactedByViewer: boolean;
};

export function summarizeReactions(
  reactions: readonly MessageReaction[],
  viewerId: string,
): ReactionSummary[] {
  const summaries = new Map<string, { count: number; reactedByViewer: boolean }>();

  for (const reaction of reactions) {
    const current = summaries.get(reaction.emoji) ?? { count: 0, reactedByViewer: false };

    current.count += 1;
    current.reactedByViewer ||= reaction.userId === viewerId;
    summaries.set(reaction.emoji, current);
  }

  return [...summaries].map(([emoji, summary]) => ({ emoji, ...summary }));
}

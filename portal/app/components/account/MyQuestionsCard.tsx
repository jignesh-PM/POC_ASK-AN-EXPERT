"use client";

import { ArrowRight, MessageSquareText } from "../Icon";
import { Card } from "../ui";
import { isExpertThread, useMyQuestions } from "@/app/lib/expert-routing";
import styles from "./Account.module.css";

/** Profile shortcut to the user's question history. */
export default function MyQuestionsCard() {
  const questions = useMyQuestions();
  const expertChats = questions.filter(isExpertThread).length;
  return (
    <Card href="/profile/questions" padding="md">
      <span className={styles.questionsIcon} aria-hidden="true">
        <MessageSquareText size={20} />
      </span>
      <h2 className={styles.questionsTitle}>My questions</h2>
      <p className={styles.questionsText}>
        {questions.length
          ? `${questions.length} ${questions.length === 1 ? "question" : "questions"} · ${expertChats} expert ${expertChats === 1 ? "chat" : "chats"}`
          : "Your Morgan AI answers and expert chats will appear here."}
      </p>
      <span className={styles.questionsLink}>
        View all questions <ArrowRight size={14} aria-hidden="true" />
      </span>
    </Card>
  );
}

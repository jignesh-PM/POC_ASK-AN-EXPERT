import Link from "next/link";

export default function QuestionsPage() {
  const questions=[["WDS board installation clearance","Waiting for expert","Microporous","12 min ago"],["Superwool Plus operating temperature","Resolved","Fibres","Yesterday"],["Castable dry-out schedule","Open","Refractories","3 Nov"]];
  return <main className="simple-page"><div className="simple-head"><p className="eyebrow">MY QUESTIONS</p><h1>Question threads</h1></div><div className="thread-list">{questions.map((q)=><Link href="/expert" className="thread-row" key={q[0]}><span className="status-dot"/><div><h2>{q[0]}</h2><p>{q[1]} · {q[2]}</p></div><time>{q[3]}</time><b>Open →</b></Link>)}</div></main>;
}

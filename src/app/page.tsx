"use client";

import EditorComp from "./_components/EditorComp";

// import dynamic from "next/dynamic";
// const EditorComp = dynamic(import("./_components/EditorComp"), { ssr: false });

export default function Home() {
  return <EditorComp />;
}

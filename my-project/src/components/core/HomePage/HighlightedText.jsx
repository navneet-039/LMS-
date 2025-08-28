export default function HighlightText({ text }) {
  return (
    <span className="font-bold bg-gradient-to-b from-[#4facfe] to-[#8e2de2] bg-clip-text text-transparent">
      {" "}
      {text}
    </span>
  );
}

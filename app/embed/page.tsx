import AvatarWidget from "@/components/AvatarWidget";

export default function EmbedPage() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
      <AvatarWidget embedded={true} />
    </div>
  );
}

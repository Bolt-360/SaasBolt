import Sidebar from "@/features/chat/components/sidebar";
import Chat from "@/features/chat/components/chat/chat";
import imagemdeFundo from "@/assets/bg.jpg";

export default function ChatPage() {
  return (
    <div
      className="min-h-screen bg-cover flex items-center justify-center p-4 pb-20"
      style={{
        backgroundImage: `url(${imagemdeFundo})`,
        backgroundRepeat: 'repeat', // Faz a imagem repetir
        backgroundSize: 'auto', // Define o tamanho da imagem como auto
        backgroundPosition: 'center', // Centraliza a imagem
      }}
    >
      <div className="bg-background rounded-lg shadow-xl w-full max-w-[90vw] h-[85vh] flex overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

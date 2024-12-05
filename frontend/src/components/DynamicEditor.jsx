import React, { useEffect, useRef } from 'react';

const DynamicEditor = React.forwardRef(({ content, onContentChange }, ref) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content; // Define o conteúdo inicial
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML); // Atualiza o conteúdo ao digitar
    }
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      className="border p-2 rounded-md min-h-[100px] focus:outline-none"
      placeholder="Digite sua mensagem aqui..."
    />
  );
});

export default DynamicEditor;
import React, { useEffect, forwardRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const DynamicEditor = forwardRef(({ content, onContentChange }, ref) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  useEffect(() => {
    if (ref) {
      ref.current = editor; // Atribui o editor à referência
    }
  }, [editor, ref]);

  return (
    <div className="relative border rounded-lg min-h-[24px] max-h-[120px] py-1 px-2 overflow-y-auto">
      <EditorContent editor={editor} style={{ minHeight: '96px', overflowY: 'auto' }} />
      {!editor?.getText() && (
        <span className="absolute top-1 left-2 text-gray-400 pointer-events-none">
          Digite uma mensagem
        </span>
      )}
    </div>
  );
});

export default DynamicEditor;

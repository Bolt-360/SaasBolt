import React, { useEffect, forwardRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Smile } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const DynamicEditor = forwardRef(({ content, onContentChange }, ref) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      setIsBold(editor.isActive('bold'));
      setIsItalic(editor.isActive('italic'));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-h-[96px] overflow-y-auto',
        style: 'overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; line-height: 24px;',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  useEffect(() => {
    if (ref) {
      ref.current = editor;
    }
  }, [editor, ref]);

  const toggleFormat = (format) => {
    editor.chain().focus()[format]().run();
  };

  const addEmoji = (emoji) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  const resetFormatting = () => {
    setIsBold(false);
    setIsItalic(false);
    setShowEmojiPicker(false);
  };

  return (
    <>
    <div className="flex-grow relative border rounded-lg">
      <EditorContent editor={editor} />
      {!editor?.getText() && (
        <span className="absolute top-2 left-3 text-gray-400 pointer-events-none">
          Digite uma mensagem
        </span>
      )}
      {showEmojiPicker && (
        <div className="absolute z-10">
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
    </div>
    <div className="flex space-x-2 mt-2">
        <div
          onClick={() => toggleFormat('toggleBold')}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <Bold size={20} />
        </div>
        <div
          onClick={() => toggleFormat('toggleItalic')}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <Italic size={20} />
        </div>
        <div
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
        >
          <Smile size={20} />
        </div>
      </div>
    </>
  );
});

export default DynamicEditor;

'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Underline,
            ListItem,
            BulletList.configure({
                HTMLAttributes: {
                    class: 'tiptap-bullet-list',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'tiptap-ordered-list',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start typing...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose max-w-none min-h-[120px] text-sm focus:outline-none tiptap-editor',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    if (!mounted || !editor) return null;

    return (
        <div className="border border-gray-300 rounded-md">
            <div className="flex gap-2 p-3 border-b border-gray-200 flex-wrap">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`text-sm px-3 py-1.5 rounded transition-colors ${editor.isActive('bold')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`text-sm px-3 py-1.5 rounded transition-colors ${editor.isActive('italic')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`text-sm px-3 py-1.5 rounded transition-colors ${editor.isActive('underline')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    <u>U</u>
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${editor.isActive('bulletList')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${editor.isActive('orderedList')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                >
                    1. List
                </button>
            </div>
            <div className="p-3">
                <EditorContent editor={editor} />
            </div>
            <style jsx global>{`
                .tiptap-editor {
                    outline: none;
                }
                
                .tiptap-editor p {
                    margin: 0.5rem 0;
                }
                
                .tiptap-editor p:first-child {
                    margin-top: 0;
                }
                
                .tiptap-editor p:last-child {
                    margin-bottom: 0;
                }
                
                .tiptap-editor ul.tiptap-bullet-list {
                    list-style-type: disc;
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }
                
                .tiptap-editor ol.tiptap-ordered-list {
                    list-style-type: decimal;
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }
                
                .tiptap-editor li {
                    margin: 0.25rem 0;
                }
                
                /* Placeholder styling for TipTap */
                .tiptap-editor .is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
                
                .tiptap-editor p.is-empty::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #9ca3af;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}
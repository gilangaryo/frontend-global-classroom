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
import HardBreak from '@tiptap/extension-hard-break';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
    const [mounted, setMounted] = useState(false);
    const [editorChanged, setEditorChanged] = useState(0);

    useEffect(() => setMounted(true), []);

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Underline,
            ListItem.configure({
                HTMLAttributes: {
                    class: 'tiptap-list-item',
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'tiptap-bullet-list'
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'tiptap-ordered-list'
                },
            }),
            HardBreak.extend({
                addKeyboardShortcuts() {
                    return {
                        'Shift-Enter': () => this.editor.commands.setHardBreak(),
                    };
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

    useEffect(() => {
        if (!editor) return;
        const updateHandler = () => setEditorChanged((p) => p + 1);
        editor.on('selectionUpdate', updateHandler);
        editor.on('transaction', updateHandler);
        return () => {
            editor.off('selectionUpdate', updateHandler);
            editor.off('transaction', updateHandler);
        };
    }, [editor]);

    if (!mounted || !editor) return null;

    return (
        <div className="border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-sky-400">
            {/* Toolbar */}
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

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Bullet List */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${editor.isActive('bulletList')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    title="Bullet list"
                >
                    • List
                </button>

                {/* Numbered List */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${editor.isActive('orderedList')
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    title="Numbered list"
                >
                    1. List
                </button>

                <span className="hidden">{editorChanged}</span>
            </div>

            {/* Editor */}
            <div className="p-3">
                <EditorContent editor={editor} />
            </div>

            {/* Styles */}
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

                /* Styling untuk Ordered List (Numbered) */
                .tiptap-editor ol.tiptap-ordered-list {
                    list-style-type: decimal !important;
                    list-style-position: outside !important;
                    padding-left: 1.5rem !important;
                    margin: 0.75rem 0 !important;
                    counter-reset: list-counter;
                }

                /* Styling untuk Bullet List */
                .tiptap-editor ul.tiptap-bullet-list {
                    list-style-type: disc !important;
                    list-style-position: outside !important;
                    padding-left: 1.5rem !important;
                    margin: 0.75rem 0 !important;
                }

                /* Styling untuk List Items */
                .tiptap-editor .tiptap-list-item {
                    margin: 0.5rem 0 !important;
                    display: list-item !important;
                }

                /* Paragraf dalam list item */
                .tiptap-editor .tiptap-list-item p {
                    margin: 0.25rem 0 !important;
                }

                /* Nested lists */
                .tiptap-editor ol ol {
                    list-style-type: lower-alpha !important;
                    margin: 0.25rem 0 !important;
                }

                .tiptap-editor ul ul {
                    list-style-type: circle !important;
                    margin: 0.25rem 0 !important;
                }

                .tiptap-editor ol ol ol {
                    list-style-type: lower-roman !important;
                }

                /* Placeholder styling */
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

                /* Override any conflicting styles */
                .tiptap-editor ol,
                .tiptap-editor ul {
                    margin-left: 0 !important;
                }
            `}</style>
        </div>
    );
}
import React, { useState } from 'react';

export default function FAQSection({ faqs }) {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Questions Fréquentes
            </h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </section>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-4 bg-white hover:bg-gray-50 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 inset-0"
            >
                <span className="font-medium text-gray-900">{question}</span>
                <span className="ml-6 flex-shrink-0">
                    <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

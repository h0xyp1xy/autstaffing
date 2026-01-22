// Capitalize first letter of every sentence
document.addEventListener('DOMContentLoaded', function() {
    function capitalizeSentences(text) {
        if (!text || text.trim().length === 0) return text;
        
        // Capitalize first letter of the text
        let result = text.charAt(0).toUpperCase() + text.slice(1);
        
        // Capitalize first letter after sentence endings (. ! ?)
        result = result.replace(/([.!?]\s+)([a-zа-яё])/g, function(match, punctuation, letter) {
            return punctuation + letter.toUpperCase();
        });
        
        return result;
    }
    
    // Selectors for text elements that should be capitalized
    const textSelectors = [
        'p', 'span', 'div', 'li', 'td', 'th', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        '.section-subtitle', '.hero-subtitle', '.feature-text',
        '.faq-answer p', '.timeline-description'
    ];
    
    // Elements to skip (already formatted or special)
    const skipSelectors = [
        'script', 'style', 'code', 'pre',
        '.hero-title', '.section-title', 
        '.logo-text', '.phone-link-top',
        '.stat-number', '.feature-number',
        '.hook-stat-number', '.number-badge'
    ];
    
    function shouldSkip(element) {
        for (const selector of skipSelectors) {
            if (element.matches && element.matches(selector)) {
                return true;
            }
            if (element.closest && element.closest(selector)) {
                return true;
            }
        }
        return false;
    }
    
    // Process text elements
    function processAllText() {
        textSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (shouldSkip(element)) return;
                    
                    // Process direct text nodes
                    Array.from(element.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
                            const original = node.textContent;
                            const capitalized = capitalizeSentences(original);
                            if (original !== capitalized) {
                                node.textContent = capitalized;
                            }
                        }
                    });
                });
            } catch (e) {
                console.warn('Error processing selector:', selector, e);
            }
        });
    }
    
    // Run immediately and also after a short delay to catch dynamically loaded content
    processAllText();
    setTimeout(processAllText, 100);
    setTimeout(processAllText, 500);
});

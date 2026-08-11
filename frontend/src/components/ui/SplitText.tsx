import type { CSSProperties, ElementType } from 'react';

interface SplitTextProps {
  /** Use \n to break lines. Each line clips its own word rise. */
  text: string;
  /** Exact substring of `text` to set in serif italic. Lands last. */
  emphasis?: string;
  /** Offset before the first word starts, in ms. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

interface Token {
  word: string;
  serif: boolean;
}

/**
 * Splits a headline into per-word spans that rise into place in sequence.
 *
 * Words are matched to the emphasis phrase by character offset rather than by
 * string equality, so a phrase like "clear" still highlights the right
 * occurrence when the word appears more than once in the headline.
 */
const tokenize = (text: string, emphasis?: string): Token[][] => {
  const emphasisStart = emphasis ? text.indexOf(emphasis) : -1;
  const emphasisEnd = emphasisStart >= 0 ? emphasisStart + (emphasis?.length ?? 0) : -1;

  let offset = 0;

  return text.split('\n').map((line) => {
    const tokens = line
      .split(/(\s+)/)
      .filter((part) => part.trim().length > 0)
      .map((word) => {
        const start = text.indexOf(word, offset);
        offset = start + word.length;

        return {
          word,
          serif: emphasisStart >= 0 && start >= emphasisStart && start + word.length <= emphasisEnd,
        };
      });

    offset += 1; // step past the newline
    return tokens;
  });
};

const SplitText: React.FC<SplitTextProps> = ({
  text,
  emphasis,
  delay = 0,
  as: Tag = 'span',
  className = '',
}) => {
  const lines = tokenize(text, emphasis);
  const totalWords = lines.reduce((sum, line) => sum + line.length, 0);

  let index = -1;

  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((tokens, lineIndex) => (
        <span className="split-line" key={lineIndex} aria-hidden="true">
          {tokens.map((token, tokenIndex) => {
            index += 1;

            // The serif word is pushed past the end of the sequence so it
            // always settles after the sans words, whatever its position.
            const order = token.serif ? totalWords + 2 : index;

            return (
              <span key={`${lineIndex}-${tokenIndex}`}>
                <span
                  className={`split-word ${token.serif ? 'serif-accent' : ''}`}
                  style={
                    {
                      '--word-index': order,
                      '--split-delay': `${delay}ms`,
                    } as CSSProperties
                  }
                >
                  {token.word}
                </span>
                {tokenIndex < tokens.length - 1 ? ' ' : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;

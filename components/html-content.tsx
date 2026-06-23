import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHTML, { MixedStyleDeclaration, MixedStyleRecord } from 'react-native-render-html';

const HORIZONTAL_PADDING = 48;

const baseStyle: MixedStyleDeclaration = {
  color: '#737381',
  fontSize: 14,
  lineHeight: 22,
};

const tagsStyles: MixedStyleRecord = {
  p: { marginTop: 0, marginBottom: 12 },
  strong: { color: '#000000', fontWeight: '600' },
  b: { color: '#000000', fontWeight: '600' },
  h1: { color: '#000000', fontSize: 20, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  h2: { color: '#000000', fontSize: 18, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  h3: { color: '#000000', fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  ul: { marginTop: 0, marginBottom: 12, paddingLeft: 16 },
  ol: { marginTop: 0, marginBottom: 12, paddingLeft: 16 },
  li: { marginBottom: 6 },
  a: { color: '#E15D02', textDecorationLine: 'underline' },
};

const systemFonts = ['System'];

type Props = {
  html?: string | null | Record<string, never>;
};

export function HtmlContent({ html }: Props) {
  const { width } = useWindowDimensions();

  const cleaned = React.useMemo(() => {
    if (typeof html !== 'string' || !html) return '';
    return html.replace(/\t/g, ' ');
  }, [html]);

  const source = React.useMemo(() => ({ html: cleaned }), [cleaned]);

  if (!cleaned) return null;

  return (
    <RenderHTML
      contentWidth={width - HORIZONTAL_PADDING}
      source={source}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
      systemFonts={systemFonts}
      defaultTextProps={{ selectable: true }}
    />
  );
}

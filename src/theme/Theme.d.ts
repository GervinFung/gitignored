import 'styled-components';
import { FontFamily } from '../component/Font';

declare module 'styled-components' {
    export interface DefaultTheme {
        pureWhite: '#FFF';
        black: '#121212';
        copyButtonBackground: '#282A36';
        primaryColor: '#0D96F2';
        previewButton: '#E91E63';
        previewButtonHover: '#C1134E';
        downloadButtonHover: '#1ECBE1';
        downloadButton: '#4BD5E7';
        gitIgnoreCodeBlock: '#E6E6E6';
        gitIgnoreCodeColor: '#333333';
        darkThemeToggle: '#A2998B';
        lightThemeToggle: '#717171';
        fontFamily: FontFamily;
    }
}

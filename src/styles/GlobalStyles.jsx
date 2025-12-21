import { colors } from './colors'
import { typography } from './typography'
import { spacing } from './spacing'

export const GlobalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: ${typography.fontPrimary};
    background-color: ${colors.bgDark};
    color: ${colors.textPrimary};
    font-size: ${typography.body};
    line-height: ${typography.lineHeightNormal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1 {
    font-size: ${typography.h1};
    font-weight: ${typography.bold};
    line-height: ${typography.lineHeightTight};
  }
  
  h2 {
    font-size: ${typography.h2};
    font-weight: ${typography.bold};
    line-height: ${typography.lineHeightTight};
  }
  
  h3 {
    font-size: ${typography.h3};
    font-weight: ${typography.semibold};
    line-height: ${typography.lineHeightTight};
  }
  
  h4 {
    font-size: ${typography.h4};
    font-weight: ${typography.semibold};
    line-height: ${typography.lineHeightNormal};
  }
  
  h5 {
    font-size: ${typography.h5};
    font-weight: ${typography.medium};
  }
  
  h6 {
    font-size: ${typography.h6};
    font-weight: ${typography.medium};
  }
  
  p {
    color: ${colors.textSecondary};
    line-height: ${typography.lineHeightNormal};
  }
  
  button {
    font-family: ${typography.fontPrimary};
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  input, textarea, select {
    font-family: ${typography.fontPrimary};
    border: 1px solid ${colors.borderLight};
    padding: ${spacing.md} ${spacing.lg};
    border-radius: 8px;
    font-size: ${typography.body};
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${colors.accentBlue};
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }
  
  a {
    color: ${colors.accentBlue};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${colors.bgLight};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.borderLight};
    border-radius: 4px;
    
    &:hover {
      background: ${colors.borderDark};
    }
  }
`

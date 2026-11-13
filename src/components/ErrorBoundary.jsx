import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" style={{ padding: 24 }}>
          <h1>Что-то пошло не так</h1>
          <p>Обновите страницу или попробуйте позже.</p>
        </main>
      );
    }
    return this.props.children;
  }
}
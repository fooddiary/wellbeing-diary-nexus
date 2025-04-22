
import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/lib/errorLogger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Обновляем состояние, чтобы при следующем рендеринге показать запасной UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Логируем ошибку
    logError("Ошибка в компоненте", { error, errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Запасной UI при ошибке
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Что-то пошло не так
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Произошла ошибка при отображении этого компонента.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => this.setState({ hasError: false })}
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

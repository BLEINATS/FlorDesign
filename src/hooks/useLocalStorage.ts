import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  // Passa a função de estado inicial para o useState para que a lógica execute apenas uma vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Tenta obter do local storage pela chave
      const item = window.localStorage.getItem(key);
      // Faz o parse do JSON armazenado ou retorna o initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se der erro, retorna o valor inicial
      console.warn(`Erro ao ler chave "${key}" do localStorage:`, error);
      return initialValue;
    }
  });

  // Retorna uma versão encapsulada da função setter do useState que ...
  // ... persiste o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função para ter a mesma API do useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Salva o estado no React
      setStoredValue(valueToStore);
      
      // Tenta salvar no local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // BLOCO CATCH ADICIONADO: Previne crash do app quando o storage está cheio
      console.warn(`Erro ao salvar chave "${key}" no localStorage:`, error);
      
      // Checa especificamente por QuotaExceededError
      if (error instanceof DOMException && 
         (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          console.error("Local Storage está cheio. Não foi possível salvar novos dados.");
          // Opcional: Aqui poderíamos disparar um toast avisando o usuário
      }
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;

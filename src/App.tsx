import './App.css'
import { MermaidChart } from './components/MermaidChart'

function App() {
  const code = `
    classDiagram
      class Notifier {
        +notify(message: string) Promise<void>
      }
      class EmailNotifier
      class SMSNotifier
      Notifier <|.. EmailNotifier
      Notifier <|.. SMSNotifier
`;


  return (
    <>
      <h1>Mermaid Demo</h1>
      <MermaidChart code={code} 
      ariaLabel="Class diagram of Notifier, EmailNotifier, SMSNotifier"
      className="w-full"/>
    </>
  )
}

export default App

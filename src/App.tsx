import './App.css'
import { MermaidChart } from './components/MermaidChart'
import { PlantUmlSvg } from './components/PlantUmlSvg'

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
const plantUml = `
  @startuml
  interface Notifier {
    +notify(message: String)
  }
  class EmailNotifier
  class SMSNotifier
  Notifier <|.. EmailNotifier
  Notifier <|.. SMSNotifier
  @enduml
`;


  return (
    <>
      <h1>UML Diagrams</h1>
      <h2>Mermaid</h2>
      <MermaidChart code={code} 
      ariaLabel="Class diagram of Notifier, EmailNotifier, SMSNotifier"
      className="w-full"/>
      <PlantUmlSvg source={plantUml} 
      ariaLabel="Notifier UML class diagram" 
      className="w-full"/>
    </>
  )
}

export default App

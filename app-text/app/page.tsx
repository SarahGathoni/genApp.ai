import Head from 'next/head';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <>
      <div className="mx-auto justify-center">
      <Head>
        <title>Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='mx-auto justify-center w-1/2 p-4 bg-white rounded-lg shadow-lg > 
'>
        <h1>ask me anything</h1>
        <ChatInterface />
      </div>
    </div>
    </>
    
  );
}

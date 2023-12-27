'use client';
import React, { useEffect } from 'react';
import 'primeicons/primeicons.css';
import { useState } from 'react';
import { TbTrash } from 'react-icons/tb';
import { Spinner } from './components/spinner';
import { AiOutlineEdit } from 'react-icons/ai';
import apiUrl from './config';
import CardModalEditTopic from './components/ModalEditTopic';
import Image from 'next/image';
import plumMain from './public/images/Plum.svg';
import topMain from './public/images/topMain.svg';
import { useUser } from '@auth0/nextjs-auth0/client';
function Home() {
  const [openModalEditTopic, setOpenModalEditTopic] = useState(false);
  const [tagIdToDelete, setTagIdToDelete] = useState<string | null>(null);

  const { user, error, isLoading } = useUser();

  interface tagResponse {
    id: string;
    name: string;
    description: string;
    image: string;
    authorId: string;
  }

  const [tags, setTags] = useState<tagResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`${apiUrl}api/tag`, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const tagsData: tagResponse[] = await result.json();
      setTags(tagsData);
    };
    fetchData();
  }, [tagIdToDelete]); // Run once when the component mounts
  console.log(tags);

  const deleteIt = async (tagId: string) => {
    try {
      const result = await fetch(`${apiUrl}api/tag`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: tagId }), // Pass the tagId here
      });
  
      if (result.ok) {
        console.log('Tag successfully deleted!');
        // Call a function to update your state and remove the deleted tag
        setTagIdToDelete(tagId);
      } else {
        console.error('Error deleting tag:', result.statusText);
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };
  
  

  if (tags.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
        <p>Loading... </p>
      </div>
    );
  }

  
  if(isLoading){
    //show the spinner
  }
  if(error){
    // return the error
  }
  if(user){
    return (
      <main className="flex flex-col items-center justify-center ">
        <br />
        <br />
        <h1 className="text-xl font-bold">Welcome! Are you ready to take notes?</h1>
  
        <br />
  
        <h2 className="text-xl font-bold">Your existing topics:</h2>
        <br />
  
        <div className="flex flex-row flex-wrap justify-center">
          {tags.map((tag: tagResponse) => (
            // this means that I need a [topic] file so the url says the topic I'm in
            <div key={tag.id} className="group min-w-[350px] max-w-[350px] bg-white overflow-hidden border-1 shadow-md sm:rounded-lg p-4 m-4 transition duration-300 ease-in-out transform hover:scale-105">
              <a key={tag.id} href={`/${tag.name}/${tag.id}`} className="block">
                <div>
                  <p className="text-xl font-semibold text-black-500 mb-2 text-center">
                    {tag.name}
                  </p>
                  <p className="text-gray-700">{tag.description}</p>
                  <br />
                </div>
              </a>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => deleteIt(tag.id)}
                  className="hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500 ml-auto"
                >
                  <TbTrash size={'2em'} />
                </button>
                <button className="focus:outline-none hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500"
                onClick={() => setOpenModalEditTopic(true)}
                >
                  <AiOutlineEdit size={28} color="black" />
                </button>
                {openModalEditTopic && (
                <CardModalEditTopic
                  onCloseModal={() => setOpenModalEditTopic(false)}
                  showCloseButton={false}
                  // onNewTag={handleEditTag}
                />)}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="absolute top-0 left-0 right-0 bottom-0 bg-white flex items-center justify-center flex-col text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Plums</h1>
      <h2 className="text-lg text-gray-600 mb-8">Please log in to continue</h2>

      <div className="z-10 w-full absolute -top-0">
        <Image src={topMain} alt="top background" fill={true} />
      </div>

      <Image
        src={plumMain}
        alt="Picture of the author"
        height={400}
        width={400}
        priority={true}
        id="main"
        className="mx-auto mt-10 mb-10 z-30 relative"
      />
      <a href="/api/auth/login">
        <button className="p-3 bg-purple-400 text-black rounded-md text-lg font-bold hover:bg-purple-400 transition-colors duration-300 w-64">Login</button>
      </a>
    </main>
  );
}

export default Home;

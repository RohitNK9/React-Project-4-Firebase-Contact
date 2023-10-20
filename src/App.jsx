import Navbar from './components/NavBar';
import { FiSearch } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { IoMdTrash } from 'react-icons/io';
import { RiEditCircleLine } from 'react-icons/ri'
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './config/firebase';
import ContactCard from './components/ContactCard';
import Modal from './components/Modal';
import AddAndUpdateContact from './components/AddandUpdateContact';
import useDisclouse from './hooks/useDisclouse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup'
import NotFoundContact from './components/NotFoundContact';

const App = () => {

  const [contacts, setContacts] = useState([]);

  const { isOpen, onClose, onOpen } = useDisclouse();

  useEffect(() => {
    const getContact = async () => {
      try {
        const contactsRef = collection(db, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const contactLists = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data()
            }
          });
          setContacts(contactLists);
          return contactLists
        })

      } catch (error) {

      }
    }
    getContact();
  }, [])

  const filterContacts = (e) => {
    const value = e.target.value;

    const contactsRef = collection(db, "contacts");

    onSnapshot(contactsRef, (snapshot) => {
      const contactLists = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      const filteredContacts = contactLists.filter((contact) =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      );

      setContacts(filteredContacts);

      return filteredContacts;
    });
  };

  return (
    <>
      <div className=" max-w-[370px] mx-auto px-4">
        <Navbar />
        <div className=' flex gap-2'>
          <div className=" flex relative items-center flex-grow">
            <FiSearch className=' ml-1 text-white text-3xl absolute' />
            <input onChange={filterContacts} type="text" className=" h-10 flex-grow rounded-md border border-white bg-transparent pl-9 text-white" />
          </div>
          <AiFillPlusCircle onClick={onOpen} className=' text-white text-5xl cursor-pointer' />
        </div>

        <div className='mt-4 gap-3 flex flex-col'>
          {contacts.length <= 0 ?<NotFoundContact/> : contacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))
          }
        </div>
      </div>
      <AddAndUpdateContact
        onClose={onClose}
        isOpen={isOpen} />
      <ToastContainer position='bottom-center' />
    </>
  )
}

export default App
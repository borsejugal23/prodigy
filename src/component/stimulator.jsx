import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Button,
  
} from '@chakra-ui/react'



function StatsCard(props) {
  const { title, stat, icon } = props
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  )
}
const Stimulator = () => {
  
  const [course,setCourse]=useState("")
  const [chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [_, setFinalTranscript] = useState('');
  const [recognition, setRecognition] = useState(null); // State for SpeechRecognition
  const [socket, setSocket] = useState(io('http://localhost:5000', { transports: ['websocket'] }))

  // useEffect(() => {
  //   // const socket = io('http://localhost:5000', { transports: ['websocket'] });

  //   socket.on('chat', (data) => {
  //     setChats((prevChats) => [...prevChats, data]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //     setChats([])
  //   };
  // }, []);
// https://prodify.onrender.com
  useEffect(() => {
    // Set up the SpeechRecognition object
   

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const newRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      newRecognition.continuous = true; // Continuously listen for speech
      newRecognition.interimResults = true; // Show interim results as the user speaks

      // Event listener when speech is recognized
      newRecognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setFinalTranscript((prevTranscript) => prevTranscript + ' ' + transcript);
          } else {
            interimTranscript += ' ' + transcript;
          }
        }
        setInputValue((prevInput) => prevInput + interimTranscript);
      };

      // Event listener when speech recognition starts
      newRecognition.onstart = () => {
        setIsListening(true);
      };

      // Event listener when speech recognition ends
      newRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(newRecognition);

      socket.on('chat', (data) => {
        setChats((prevChats) => [...prevChats, data]);


      })
      return () => {
        socket.disconnect();
      };
    }
  }, []);
  // console.log(course)
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    // The textarea height is automatically adjusted using CSS "auto" and "scrollHeight"
  };

  // const handleSendButton = (course) => {
  //   // const socket = io('http://localhost:5000', { transports: ['websocket'] });
  //   if (inputValue === "start") {
  //     console.log(course)
  //     // let text = `I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the position of  ${course} Developer.
  //     // I want you to only reply as the interviewer. Do not write all the conservation at once. I want you to only do the technical interview with me on coding 
  //     // “start the interview”. Ask one question at a time  if I am not able to answer satisfactorily, give me feedback  in formmat like
  //     // {<Ask me the questions individually like an interviewer and wait for my answers. Do not ask more than one question at a time >}
  //     // Questions can include both new questions and follow up questions from the previous questions. Continue the process until I ask you to stop.  And, you will stop the interview when I tell you to stop using the phrase “stop the interview”. After that,  provide me overall  feedback ,
  //     // The cumulative feedback generated at the end should be evaluated using the following rubrics. While grading my responses you have to very strict like a real interviewer
  //     // 1.Subject Matter Expertise
  //     // 2.Communication skills
  //     // 3. Problem Solving skills
  //     // 4.Hiring criteria : Options are Reject, Waitlist, Hire and Strong Hire
  //     // Feedback for Subject Matter Expertise and Communication skills should contain ratings on my interview responses from 0 - 10`;
  //     var text=`I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the position of  ${course}.
  //     I want you to only reply as the interviewer. Do not write all the conservation at once. I want you to only do the technical interview with me on coding 
  //     “start the interview”     . Ask one question at a time  if I am not able to answer satisfactorily, give me feedback  in formmat like
  //    {<Ask me the questions individually like an interviewer and wait for my answers. Do not ask more than one question at a time >}
  //    Questions can include both new questions and follow up questions from the previous questions. Continue the process until I ask you to stop.  And, you will stop the interview when I tell you to stop using the phrase “stop the interview”. After that,  provide me overall  feedback ,
  //    The cumulative feedback generated at the end should be evaluated using the following rubrics. While grading my responses you have to very strict like a real interviewer`
  //     console.log("course :",text)
  //     socket.emit('chat', text);
  //   }
  //   // socket.emit('chat', inputValue);

  //   setInputValue('');
  //   setFinalTranscript('');
  //   // socket.disconnect();
  // };


  const handleSendButton = () => {
    if (inputValue === "start") {
      if (course.trim() === "") {
        // If no course is selected, don't send the message and show an error.
        alert("Please select a course before starting the interview.");
        return;
      }
  
      const message = `I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for the position of ${course}.
        I want you to only reply as the interviewer. Do not write all the conversation at once. I want you to only do the technical interview with me on coding 
        “start the interview”. Ask one question at a time. If I am not able to answer satisfactorily, give me feedback in the format like
        {<Ask me the questions individually like an interviewer and wait for my answers. Do not ask more than one question at a time.>}
        Questions can include both new questions and follow-up questions from the previous questions. Continue the process until I ask you to stop. And, you will stop the interview when I tell you to stop using the phrase “stop the interview”. After that, provide me overall feedback.
        The cumulative feedback generated at the end should be evaluated using the following rubrics. While grading my responses, you have to be very strict like a real interviewer.`;
  
      console.log("Message:", message);
      socket.emit('chat', message);
      setInputValue('');
      setFinalTranscript('');
  
    }else{
      socket.emit('chat', inputValue);
      setInputValue('');
      setFinalTranscript('');
  
    }
  
    // setInputValue('');
    // setFinalTranscript('');
  };
  
  const handleVoiceButton = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  return (
    <div className="p-4">
      <div>
      <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
       Please select the course for interview
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
      <Button
          colorScheme="teal"
          size="lg"
          variant="outline"
          boxShadow="md"
          cursor="pointer"
          _hover={{ bg: 'teal.500', color: 'white' }}
          value={"Full stack developer"}

          onClick={(e)=>setCourse(e.target.value)}
        >
          Full stack developer
        </Button>
        <Button
          colorScheme="teal"
          size="lg"
          variant="outline"
          boxShadow="md"
          cursor="pointer"
          _hover={{ bg: 'teal.500', color: 'white' }}
          value={"Frontend developer"}

          onClick={(e)=>setCourse(e.target.value)}

        >
          Frontend developer
        </Button>
        <Button
          colorScheme="teal"
          size="lg"
          variant="outline"
          boxShadow="md"
          cursor="pointer"
          _hover={{ bg: 'teal.500', color: 'white' }}
          value={"Backend developer"}
          onClick={(e)=>setCourse(e.target.value)}

        >
          Backend developer
        </Button>
        
      </SimpleGrid>
    </Box>
      </div>
      <br /><br /><br /><br /><br />
      <h1 className="text-2xl font-bold mb-4" style={{fontWeight:'bold',fontSize:"30px"}}>Welcome to chat</h1>
      <br /><br />
      <div id="chats">
        {chats.map((chat, index) => (
          <p key={index} className="message"
          style={{ color: chat.startsWith('AI') ? 'red' : 'blue',width:"fit-content" ,backgroundColor:"#E5E7EB",marginBottom:"1%",textAlign:"left",padding:"3px",borderRadius:"5px" }}>
            {chat}
          </p>
        ))}
      </div>
      <div className="flex items-center">
        <textarea
          id="myTextarea"
          placeholder="Ask A question..."
          value={inputValue}
          onChange={handleInputChange}
          style={{width:"80%",border:"2px solid black"}}        ></textarea>
        <button
          id="sendBtn"
          disabled={!inputValue.trim()}
          className={`px-4 py-2 ml-2 text-white rounded-md ${inputValue.trim() ? 'bg-teal-500' : 'bg-red-500'}`}
          onClick={()=>handleSendButton(course)}
        >
          <i className="material-icons" style={{backgroundColor:inputValue===""?"green":"red"}}>&#xe163;</i>
        </button>
        <button id="startButton" className="ml-2" onClick={handleVoiceButton}>
          <i className="fa" id="voice" style={{ marginTop: '40%', marginBottom: '50%' }}>
            {isListening ? '...' : '\uf130'}
          </i>
        </button>
      </div>
      <br /><br /><br /><br /><br />
    </div>
  );
};

export default Stimulator;

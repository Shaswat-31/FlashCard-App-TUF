import React, { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./components/flashcard";
import Dashboard from "./components/dashboard";
import { Button, Spinner } from "@chakra-ui/react";
import "./App.css";

const App = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get(
        "https://flashcard-app-tuf.onrender.com/api/flashcards"
      );
      setFlashcards(response.data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
    setToggle((prevToggle) => !prevToggle); // Trigger toggle to reset flip state
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
    );
    setToggle((prevToggle) => !prevToggle); // Trigger toggle to reset flip state
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen gap-4 p-4">
      <div className="flex flex-col items-center justify-center">
        {loading ? (
          <Spinner
            size="xl"
            color="teal.500"
            thickness="4px"
            emptyColor="gray.200"
            speed="0.65s"
            label="Loading"
          />
        ) : flashcards.length > 0 ? (
          <Flashcard flashcard={flashcards[currentIndex]} resetFlip={toggle} />
        ) : (
          <Flashcard flashcard={"Nothing to Show"} resetFlip={toggle} />
        )}
        <div className="mt-4 flex space-x-4">
          <Button colorScheme="teal" variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
          <Button colorScheme="teal" variant="outline" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 p-4 rounded-lg shadow-lg">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;

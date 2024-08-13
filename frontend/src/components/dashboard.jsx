import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, useDisclosure, Box, Text, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from "@chakra-ui/react";
import CustomAlertDialog from "./CustomAlertDialog";
import { AddIcon } from "@chakra-ui/icons";

const Dashboard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState({ question: "", answer: "" });
  const [editCard, setEditCard] = useState({ id: null, question: "", answer: "" });
  const [selectedCard, setSelectedCard] = useState(null);
  const [dialogType, setDialogType] = useState(""); // "add", "edit", "delete"
  const [showFlashcards, setShowFlashcards] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get("https://flashcard-app-tuf.onrender.com/api/flashcards");
      setFlashcards(response.data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("https://flashcard-app-tuf.onrender.com/api/flashcards", newCard);
      fetchFlashcards();
      setNewCard({ question: "", answer: "" });
      onClose();
      window.location.reload(false);
    } catch (error) {
      console.error("Error adding flashcard:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://flashcard-app-tuf.onrender.com/api/flashcards/${editCard.id}`, editCard);
      fetchFlashcards();
      setEditCard({ id: null, question: "", answer: "" });
      onClose();
      window.location.reload(false);
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleDelete = async (id) => {
    try {      
      await axios.delete(`https://flashcard-app-tuf.onrender.com/api/flashcards/${id}`);
      fetchFlashcards();
      onClose();
      window.location.reload(false);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const openDialog = (type, card = null) => {
    setDialogType(type);
    setSelectedCard(card);
    if (type === "edit") {
      setEditCard({ id: card.id, question: card.question, answer: card.answer });
    }
    onOpen();
  };

  return (
    <div className="h-full w-full">
      <div
        className="flex items-center justify-center h-20 w-20 bg-white rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-slate-100"
        onClick={() => openDialog("add")}
      >
        <AddIcon />
      </div>
      <div className="flex flex-col justify-center items-center p-4 space-y-4 mt-5">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <Button
            colorScheme="teal"
            onClick={() => setShowFlashcards(!showFlashcards)}
            className="w-full md:w-auto"
          >
            {showFlashcards ? "Hide Flashcards" : "Show Flashcards"}
          </Button>
        </div>

        {showFlashcards && (
          <Accordion allowToggle>
            {flashcards.map((card) => (
              <AccordionItem key={card.id}>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      <h1> {card.question} </h1>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <h1>{card.answer}</h1>
                  <div className="space-x-2 mt-2">
                    <Button colorScheme="teal" onClick={() => openDialog("edit", card)}>
                      Edit
                    </Button>
                    <Button colorScheme="red" onClick={() => openDialog("delete", card)}>
                      Delete
                    </Button>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <CustomAlertDialog
          isOpen={dialogType === "add" || dialogType === "edit"}
          onClose={() => {
            setDialogType("");
            onClose();
          }}
          title={dialogType === "add" ? "Add Flashcard" : "Edit Flashcard"}
          body={
            <Box>
              <Input
                placeholder="Question"
                value={dialogType === "add" ? newCard.question : editCard.question}
                onChange={(e) => {
                  if (dialogType === "add") {
                    setNewCard({ ...newCard, question: e.target.value });
                  } else {
                    setEditCard({ ...editCard, question: e.target.value });
                  }
                }}
                className="mb-2"
              />
              <Input
                placeholder="Answer"
                value={dialogType === "add" ? newCard.answer : editCard.answer}
                onChange={(e) => {
                  if (dialogType === "add") {
                    setNewCard({ ...newCard, answer: e.target.value });
                  } else {
                    setEditCard({ ...editCard, answer: e.target.value });
                  }
                }}
              />
            </Box>
          }
          onConfirm={dialogType === "add" ? handleAdd : handleUpdate}
          confirmText={dialogType === "add" ? "Add Flashcard" : "Save"}
          cancelText="Cancel"
          confirmColorScheme="teal"
        />

        <CustomAlertDialog
          isOpen={dialogType === "delete"}
          onClose={() => {
            setDialogType("");
            onClose();
          }}
          title="Delete Flashcard"
          body="Are you sure? You can't undo this action afterwards."
          onConfirm={() => handleDelete(selectedCard.id)}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColorScheme="red"
        />
      </div>
    </div>
  );
};

export default Dashboard;

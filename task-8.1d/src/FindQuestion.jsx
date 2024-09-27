import { useState, useEffect } from 'react';
import { Card, Button, Form, Container } from 'semantic-ui-react';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from './Utils/firebase'; 

const FindQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({ title: '', tag: '', date: '' });
  const [expandedQuestions, setExpandedQuestions] = useState({}); // State to track which questions are expanded

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
      const fetchedQuestions = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setQuestions(fetchedQuestions);
    });

    return () => unsubscribe();
  }, []);

  const handleFilterChange = (e, { name, value }) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = (question) => {
    const { title, tag, date } = filters;

    const titleMatch = !title || question.title.toLowerCase().includes(title.toLowerCase());
    const dateMatch = !date || question.date === date;

    let tagMatch = true;
    if (tag) {
      if (Array.isArray(question.tags)) {
        // If tags are stored as an array
        tagMatch = question.tags.some((t) =>
          t.toLowerCase().includes(tag.toLowerCase())
        );
      } else if (typeof question.tags === 'string') {
        tagMatch = question.tags.toLowerCase().includes(tag.toLowerCase());
      } else {
        tagMatch = false;
      }
    }

    return titleMatch && tagMatch && dateMatch;
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const toggleDescription = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  const getShortDescription = (description) => {
    return description.length > 100 ? `${description.substring(0, 100)}...` : description;
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      <h2>Find Question</h2>

      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Filter by Title"
            placeholder="Enter title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
          />
          <Form.Input
            fluid
            label="Filter by Tag"
            placeholder="Enter tag"
            name="tag"
            value={filters.tag}
            onChange={handleFilterChange}
          />
          <Form.Input
            fluid
            label="Filter by Date"
            placeholder="Enter date (YYYY-MM-DD)"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </Form.Group>
      </Form>

      <Card.Group>
        {questions.filter(applyFilters).map((question) => (
          <Card key={question.id}>
            <Card.Content>
              <Card.Header>{question.title}</Card.Header>
              <Card.Meta>
                {/* Display tags appropriately */}
                {Array.isArray(question.tags)
                  ? question.tags.join(', ')
                  : question.tags}
              </Card.Meta>
              <Card.Meta>{question.date}</Card.Meta>

              <Card.Description>
                {expandedQuestions[question.id]
                  ? question.description
                  : getShortDescription(question.description)}
              </Card.Description>

              <Button
                onClick={() => toggleDescription(question.id)}
                style={{ marginTop: '10px' }}
              >
                {expandedQuestions[question.id] ? 'Show Less' : 'Show More'}
              </Button>
            </Card.Content>
            <Card.Content extra>
              <Button
                negative
                onClick={() => handleDelete(question.id)}
              >
                Delete
              </Button>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>

      {questions.filter(applyFilters).length === 0 && (
        <p style={{ marginTop: '20px' }}>No questions found.</p>
      )}
    </Container>
  );
};

export default FindQuestion;

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { Container, Dropdown, Button } from 'semantic-ui-react';
import HomePage from './HomePage';
import QuestionForm from './QuestionForm';
import ArticleForm from './ArticleForm';
import FindQuestion from './FindQuestion';
import FindArticle from './FindArticle';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './Utils/firebase';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [postType, setPostType] = useState('question');
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    tags: '',
    articleText: '',
    abstract: '',
    imageURL: '',
  });

  const handlePostTypeChange = (e, { value }) => setPostType(value);

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: "light",
      transition: Bounce,
    });
  };

  const addPost = async (collectionName, postData) => {
    try {
      await addDoc(collection(db, collectionName), postData);
      showToast(`${postType.charAt(0).toUpperCase() + postType.slice(1)} added successfully!`);
    } catch (error) {
      console.error(`Error adding ${postType}: `, error);
      showToast(`Error adding ${postType}. Please try again.`, 'error');
    }
  };

  const handleSubmit = () => {
    const postData = {
      title: formValues.title,
      tags: formValues.tags,
      date: new Date().toISOString().split('T')[0],
    };

    if (postType === 'question') {
      addPost('questions', { ...postData, description: formValues.description });
    } else {
      addPost('articles', {
        ...postData,
        abstract: formValues.abstract,
        articleText: formValues.articleText,
        imageURL: formValues.imageURL,
      });
    }

    setFormValues({
      title: '',
      description: '',
      tags: '',
      articleText: '',
      abstract: '',
      imageURL: '',
    });
  };

  const HeaderWithHomeButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <div className="custom-header">
        <span>{location.pathname === '/new-post' ? 'New Post Page' : 'Find Question Page'}</span>
        {location.pathname !== '/' && (
          <Button
            onClick={() => navigate('/')}
            primary
            style={{ float: 'right', marginTop: '-5px' }}
          >
            Back to Home
          </Button>
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className="app-container">
        <HeaderWithHomeButton />
        <Container className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-question" element={<FindQuestion />} />
            <Route path="/find-article" element={<FindArticle />} />
            <Route path="/new-post" element={
              <>
                <div className="header-subtext">Select Post Type</div>
                <Dropdown
                  placeholder="Select Post Type"
                  selection
                  options={[
                    { key: 'question', text: 'Question', value: 'question' },
                    { key: 'article', text: 'Article', value: 'article' },
                  ]}
                  value={postType}
                  onChange={handlePostTypeChange}
                  className="dropdown"
                />
                {postType === 'question' ? (
                  <QuestionForm
                    formValues={formValues}
                    setFormValues={setFormValues}
                    handleSubmit={handleSubmit}
                  />
                ) : (
                  <ArticleForm
                    formValues={formValues}
                    setFormValues={setFormValues}
                    handleSubmit={handleSubmit}
                  />
                )}
              </>
            } />
          </Routes>
        </Container>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;

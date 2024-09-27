import { Container, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate(); 

  return (
    <Container className="home-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the DEV@Deakin Application</h1>
      <Button primary onClick={() => navigate('/new-post')} style={{ margin: '10px' }}>
        New Post
      </Button>
      <Button secondary onClick={() => navigate('/find-question')} style={{ margin: '10px' }}>
        Question
      </Button>
      <Button secondary onClick={() => navigate('/find-article')} style={{ margin: '10px' }}>
        Article
      </Button>
     
    </Container>
  );
};

export default HomePage;

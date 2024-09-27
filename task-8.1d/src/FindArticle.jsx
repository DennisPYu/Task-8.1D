import { useState, useEffect } from 'react';
import { Card, Button, Container, Image } from 'semantic-ui-react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { db, storage } from './Utils/firebase';
import { toast } from 'react-toastify';

const FindArticle = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'articles'));
        const articleData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setArticles(articleData);
      } catch (error) {
        toast.error(`Error fetching articles: ${error.message}`);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (articleId, imagePath) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'articles', articleId));

      if (imagePath) {
        const imageStorageRef = storageRef(storage, imagePath);
        await deleteObject(imageStorageRef);
        toast.success('Image and article deleted successfully!');
      } else {
        toast.success('Article deleted successfully!');
      }

      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== articleId));
    } catch (error) {
      toast.error(`Error deleting article: ${error.message}`);
    }
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      <h2>Find Article Page</h2>
      <Card.Group>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id}>
              <Card.Content>
                <Card.Header>{article.title}</Card.Header>
                <Card.Meta>{article.date}</Card.Meta>
                <Card.Description>{article.abstract}</Card.Description>
                {article.imageURL && (
                  <Image src={article.imageURL} alt="Article" style={{ marginTop: '10px' }} />
                )}
              </Card.Content>
              <Card.Content extra>
                <Button
                  negative
                  onClick={() => handleDelete(article.id, article.imagePath)}
                >
                  Delete
                </Button>
              </Card.Content>
            </Card>
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </Card.Group>
    </Container>
  );
};

export default FindArticle;

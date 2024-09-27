import PropTypes from 'prop-types';
import { Form, Header, Button } from 'semantic-ui-react';
import { useState } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from './Utils/firebase';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';

const ArticleForm = ({ formValues, setFormValues }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState('');

  // Handles form field changes
  const handleChange = (e, { name, value }) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      let downloadURL = '';

      if (imageUpload) {
        const imageRef = storageRef(storage, `articles/images/${uuid()}`);
        const snapshot = await uploadBytes(imageRef, imageUpload);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'articles'), {
        title: formValues.title,
        abstract: formValues.abstract,
        articleText: formValues.articleText,
        tags: formValues.tags,
        date: new Date().toISOString().split('T')[0],
        imageURL: downloadURL,
      });

      toast.success('Article submitted successfully!');
      
      setFormValues({
        title: '',
        abstract: '',
        articleText: '',
        tags: '',
      });
      setImageUpload(null);
      setImageURL(''); 

    } catch (error) {
      toast.error(`Error submitting article: ${error.message}`);
    }
  };

  return (
    <Form onSubmit={handleSubmitForm}>
      <Header as="h4" style={{ marginTop: '20px', marginBottom: '10px' }}>
        What do you want to ask or share?
      </Header>
      <Form.Input
        label="Title"
        placeholder="Enter a descriptive title"
        style={{ marginBottom: '15px' }}
        name="title"
        value={formValues.title}
        onChange={handleChange}
      />
      <Header as="h5" style={{ marginTop: '20px' }}>
        Upload an Image
      </Header>
      <Form.Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: '15px' }}
      />

      {imageURL && (
        <div style={{ marginTop: '10px' }}>
          <p>Image uploaded: <a href={imageURL} target="_blank" rel="noopener noreferrer">{imageURL}</a></p>
        </div>
      )}

      <Form.TextArea
        label="Abstract"
        placeholder="Enter a 1-paragraph abstract"
        style={{ marginBottom: '15px' }}
        name="abstract"
        value={formValues.abstract}
        onChange={handleChange}
      />
      <Form.TextArea
        label="Article Text"
        placeholder="Enter your article"
        style={{ marginBottom: '15px', height: '150px' }}
        rows={10}
        name="articleText"
        value={formValues.articleText}
        onChange={handleChange}
      />
      <Form.Input
        label="Tags"
        placeholder="Please add up to 3 tags to describe what your article is about e.g., Java"
        style={{ marginBottom: '15px' }}
        name="tags"
        value={formValues.tags}
        onChange={handleChange}
      />

      <Button primary type="submit">
        Submit Article
      </Button>
    </Form>
  );
};

ArticleForm.propTypes = {
  formValues: PropTypes.shape({
    title: PropTypes.string,
    abstract: PropTypes.string,
    articleText: PropTypes.string,
    tags: PropTypes.string,
  }).isRequired,
  setFormValues: PropTypes.func.isRequired,
};

export default ArticleForm;

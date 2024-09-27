import PropTypes from 'prop-types';
import { Form, Header, Button } from 'semantic-ui-react';

const QuestionForm = ({ formValues, setFormValues, handleSubmit }) => {
    const handleChange = (e, { name, value }) => {
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Header as="h4" style={{ marginTop: '20px', marginBottom: '10px' }}>
                What do you want to ask or share?
            </Header>
            <Form.Input
                label="Title"
                placeholder="Start your question with how, what, why, etc."
                style={{ marginBottom: '15px' }}
                name="title"
                value={formValues.title}
                onChange={handleChange}
            />
            <Form.TextArea
                label="Describe your problem"
                placeholder="Please provide details about your question"
                style={{ marginBottom: '15px', height: '150px' }}
                rows={10}
                name="description"
                value={formValues.description}
                onChange={handleChange}
            />
            <Form.Input
                label="Tags"
                placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
                style={{ marginBottom: '15px' }}
                name="tags"
                value={formValues.tags}
                onChange={handleChange}
            />
            <Button primary type="submit">
                Submit Question
            </Button>
        </Form>
    );
};

QuestionForm.propTypes = {
    formValues: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        tags: PropTypes.string,
    }).isRequired,
    setFormValues: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

export default QuestionForm;

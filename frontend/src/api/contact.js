import api from './index';

export const contactService = {
  // Send contact message
  sendContactMessage: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  }
};

export default contactService;
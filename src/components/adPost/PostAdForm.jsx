import React, { useState } from 'react';
import Header from './header';
import Step1CategorySelect from './Step1CategorySelect';
import Step2SubcategorySelect from './Step2SubcategorySelect';
import Step3AdDetails from './Step3AdDetails';
import Step4Images from './Step4Images';
import Step5FeatureSelect from './Step5FeatureSelect';

const PostAdForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category_id: '',
    subcategory_id: '',
    title: '',
    description: '',
    price: '',
    location: '',
    dynamic_fields: [],
    images: [],
    feature_type: 'free', // or 'featured'
  });

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  return (
    <><Header />
    <div className="max-w-2xl mx-auto p-4 bg-white">
      {step === 1 && <Step1CategorySelect formData={formData} setFormData={setFormData} next={next} />}
      {step === 2 && <Step2SubcategorySelect formData={formData} setFormData={setFormData} next={next} back={back} />}
      {step === 3 && <Step3AdDetails formData={formData} setFormData={setFormData} next={next} back={back} />}
      {step === 4 && <Step4Images formData={formData} setFormData={setFormData} next={next} back={back} />}
      {step === 5 && <Step5FeatureSelect formData={formData} setFormData={setFormData} back={back} />}
    </div>
    </>
  );
};

export default PostAdForm;
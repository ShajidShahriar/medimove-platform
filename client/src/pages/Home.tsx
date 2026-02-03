import Hero from '../components/Hero';
import DepartmentGrid from '../components/DepartmentGrid';
import Features from '../components/Features';
import BestSellers from '../components/BestSellers';
import LeadCapture from '../components/LeadCapture';

export default function Home() {
  return (
    <>
      <Hero />
      <DepartmentGrid />
      <Features />
      <BestSellers />
      <LeadCapture />
    </>
  );
}
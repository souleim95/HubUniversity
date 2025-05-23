import styled from 'styled-components';



export const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 120px; /* 🔥 Ajout clé ici */
  background-color: rgba(212, 213, 247, 0.9);
  min-height: 130vh;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 130px; /* Adapté sur mobile */
  }
`;



export const AdminHeader = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin: 2rem 0; /* Ajouté */
  margin-top: 80px; /* 🔥 Important pour éviter le débordement */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    margin-top: 100px;
  }
`;


export const AdminTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const AdminSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 800px;
  line-height: 1.6;
`;

export const Section = styled.section`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
`;


export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #3b82f6;
  }
`;

export const ActionButton = styled.button`
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    cursor: pointer;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;

  @media (max-width: 600px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;


export const TableHeader = styled.thead`
  background-color: #f3f4f6;
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }

  &:hover {
    background-color: #f3f4f6;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  color: #4b5563;
  font-size: 0.875rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;


export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #3b82f6;
  }
`;

export const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'admin':
        return '#805ad5';
      case 'gestionnaire':
        return '#3182ce';
      case 'student':
        return '#38a169';
      case 'active':
        return '#dcfce7';
      case 'maintenance':
        return '#fef3c7';
      case 'inactive':
        return '#fee2e2';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active':
        return '#166534';
      case 'maintenance':
        return '#92400e';
      case 'inactive':
        return '#991b1b';
      default:
        return '#4b5563';
    }
  }};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;


export const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  background-color: #e5e7eb;
  color: #374151;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #d1d5db;
  }
`;

export const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  background-color: #3b82f6;
  color: white;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #2563eb;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;


export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const AlertBanner = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case 'warning':
        return '#fef3c7';
      case 'error':
        return '#fee2e2';
      case 'success':
        return '#dcfce7';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'warning':
        return '#92400e';
      case 'error':
        return '#991b1b';
      case 'success':
        return '#166534';
      default:
        return '#374151';
    }
  }};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TabsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const TabsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
`;


export const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  position: relative;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  background-color: ${props => props.active ? '#eff6ff' : 'transparent'};
  transition: all 0.2s ease-in-out;
  border: ${props => props.active ? '2px solid #3b82f6' : 'none'};
  
  &:hover {
    background-color: ${props => props.active ? '#eff6ff' : '#f3f4f6'};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? '#3b82f6' : 'transparent'};
  }
`;

export const ExportButton = styled.button`
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #059669;
  }
`;

export const bodyAdmin = styled.div`
  position: relative;
  top: 20px;
  padding-top: 120px;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  z-index: -1;
  overflow: hidden;
  background-color: rgb(36, 106, 187);
`;
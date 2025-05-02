import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

/**
 * A reusable card component for displaying content with an optional title, description, 
 * info tooltip, and various layout options.
 *
 * @component
 * @param {Object} props - Props for CardComponent.
 * @param {string} props.title - The main title text displayed at the top of the card.
 * @param {string} [props.description] - Optional description text below the title.
 * @param {React.ReactNode} props.children - Child components or content to be rendered inside the card.
 * @param {boolean} [props.moveTitleUp=false] - Moves the title closer to the top if true.
 * @param {boolean} [props.marginBottom=false] - Adds bottom margin to the description if true.
 * @param {boolean} [props.centerContent=false] - If true, centers the card's children vertically and horizontally.
 * @param {string|React.ReactNode} [props.infoContent] - Optional content for the tooltip displayed next to the title.
 * @param {Object} [props.sx] - Custom MUI `sx` styles to be applied to the outer card.
 * @returns {JSX.Element} The rendered card component.
 */
const CardComponent = ({ 
  title, 
  description, 
  children, 
  moveTitleUp, 
  marginBottom, 
  centerContent, 
  infoContent, 
  sx 
}) => {
  return (
    <Card sx={{ 
      margin: 2, 
      boxShadow: 2, 
      borderRadius: 3, 
      ...sx 
    }}>
      <CardContent sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: moveTitleUp ? 2 : 4,
            ml: 4,
            mr: 2,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {infoContent && (
            <Tooltip 
              title={
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                  {infoContent}
                </Typography>
              }
              placement="top"
              arrow
            >
              <IconButton
                size="small"
                sx={{
                  padding: 0,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: 'transparent' },
                }}
              >
                <InfoOutlineIcon fontSize="small" sx={{ color: '#555' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography 
          color="text.secondary" 
          gutterBottom 
          sx={{ 
            textAlign: 'left', 
            mb: marginBottom ? 2 : 0, 
            ml: 4, 
          }}
        >
          {description}
        </Typography>

        <Box sx={{ 
          ...(centerContent 
            ? { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' } 
            : {})
        }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardComponent;

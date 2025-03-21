//helper ..>// utils.js or a similar utility file
export const FormatDate = (dat) => {
    if (!dat || typeof dat !== 'string') {
      return 'Invalid date'; // Handle invalid date cases
    }
  
    // Extract the date part from the datetime string
    const [datePart] = dat.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
  
    // Create a Date object
    const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
  
   
  
    // Format the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
  
    // Return the formatted date in the desired format: "14, August 2024"
    return formattedDate.replace(/(\d{1,2}),/, '$1,');
  };
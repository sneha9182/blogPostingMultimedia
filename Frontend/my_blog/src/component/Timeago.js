export default function TimeAgo(timestamp) {
    const createdDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate; // Difference in milliseconds

    const diffInSeconds = Math.floor(timeDifference / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} `;
    } else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} `;
    } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} `;
    } else if (diffInHours > 0) {
        return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} `;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} `;
    } else {
        return `${diffInSeconds} sec${diffInSeconds > 1 ? 's' : ''} `;
    }
}

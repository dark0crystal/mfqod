export default async function PostDetails({ params }: { params: { postId: string } }) {
    const postId = params.postId;
  
    try {
      const response = await fetch(`/api/get-items/${postId}`, {
        cache: 'no-store', // Ensures you fetch fresh data each time.
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
  
      const data = await response.json();
  
      return (
        <div>
          <h1>{data.title || 'Untitled Post'}</h1>
          <p>{data.content || 'No content available'}</p>
          <p>Posted by: {data.author || 'Unknown'}</p>
        </div>
      );
    } catch (error) {
      console.error('Error fetching post details:', error);
      return <p>Error loading post details. Please try again later.</p>;
    }
  }
  
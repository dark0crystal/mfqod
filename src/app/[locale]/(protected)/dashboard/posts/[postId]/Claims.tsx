'use client';
import React, { useState, useEffect } from 'react';

// Claims Component
export default function Claims({ postId }: { postId: string }){
  const [claims, setClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function handleClaimApproval(claimId:string ,approval:boolean){
    try {
      
    
    const response  = await fetch("/api/post-claim-approval" ,{
      method:"PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claimId: claimId,
        approval
      }),

    })
    if(response.ok){
      console.log("claim approved successfully")
      fetchClaims()
    }
    } catch (error) {
        console.log("failed to change the claim approval")
    }

    
  }

  const fetchClaims = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/get-claims?postId=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch claims');
      }
      const data = await response.json();
      console.log(data)
      setClaims(data);
    } catch (err) {
      setError('Error fetching claims.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch claims automatically on component mount
  useEffect(() => {
    fetchClaims();
  }, [postId]);

  return (
    <div className="mt-6">
      <button
        onClick={fetchClaims}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Reload Claims
      </button>

      {isLoading && <p className="mt-4 text-gray-500">Loading claims...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {claims.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Claims</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {claims.map((claim, index) => (
              <li key={index}>
                <p>
                  <strong>Claim ID:</strong> {claim.id}
                </p>
                <p>
                  <strong>Description:</strong> {claim.claimTitle}
                </p>
                <p>
                  <strong>claimContent:</strong> {claim.claimContent}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString()}
                </p>
                <p>{claim.approved}</p>
                <div>
                  {claim.approved == true ? 
                  (
                  <button onClick={()=>{handleClaimApproval(claim.id ,false)}}>approved</button>
                )
                  :(
                    <button onClick={()=>{handleClaimApproval(claim.id ,true)}}>not approved</button>
                  )
                  }
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {claims.length === 0 && !isLoading && (
        <p className="mt-4 text-gray-500">No claims available for this post.</p>
      )}
    </div>
  );
};

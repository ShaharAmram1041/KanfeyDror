import React, { useEffect, useState } from "react";
import Information from "./components/InformationField/Information";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase_setup/firebase";
import "./Home.css";
import ContactForm from "./components/contactForm/ContactForm";
import FollowReport from "./components/FollowReportPage/FollowReport";
import SendReport from "./components/SendReport/SendReport";

export default function Home({ isAuth }) {
  const [postList, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "Information");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  });

  const deletePost = async (id) => {
    const postDoc = doc(db, "Information", id);
    await deleteDoc(postDoc);
  };

  return (
    <>
      <div className="homePage">
        {postList.map((post) => {
          return (
            <div className="post" key={post.id}>
              <div className="postHeader">
                <div className="title">
                  <h2>{post.title}</h2>
                </div>
              </div>
              <div className="postTextContainer">{post.informationText}</div>
              <div className="deletePost">
                {isAuth && (
                  <button
                    className="delete_button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "האם אתה בטוח שברצונך למחק את השדה מידע הזה?"
                        )
                      ) {
                        deletePost(post.id);
                      }
                    }}
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!isAuth && (
        <div className="reportContainer">
          {/* <FollowReport /> */}
          <SendReport />
        </div>
      )}
    </>
  );
}

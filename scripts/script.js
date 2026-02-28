$(function () {
  // ========================================
  // PART 0: SESSION VALIDATION
  // ========================================
  function validateSession() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const sessionId = localStorage.getItem("sessionId");

    if (!loggedInUser || !sessionId || loggedInUser.sessionId !== sessionId) {
      window.location.href = "login.html";
      return null;
    }

    return loggedInUser;
  }

  // Validate session on page load
  const loggedInUserData = validateSession();
  if (!loggedInUserData) return; 

  // ========================================
  // PART 1: HELPER FUNCTIONS
  // ========================================

  function getInitials(displayName) {
    if (!displayName) return "U";

    const nameParts = displayName.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    const firstLetter = nameParts[0].charAt(0);
    const lastLetter = nameParts[nameParts.length - 1].charAt(0);
    return (firstLetter + lastLetter).toUpperCase();
  }

  function getAvatarColor(displayName) {
    const colorList = [
      "#1f2937",
      "#6b21a8",
      "#065f46", 
      "#0ea5a4", 
      "#dc2626", 
      "#f59e0b", 
    ];

    let colorNumber = 0;
    for (let i = 0; i < displayName.length; i++) {
      colorNumber =
        displayName.charCodeAt(i) + ((colorNumber << 5) - colorNumber);
    }

    const colorIndex = Math.abs(colorNumber) % colorList.length;
    return colorList[colorIndex];
  }

  function makeInitialsSVG(name, bgColor, size = 42) {
    const initials = getInitials(name || "");
    const w = size;
    const h = size;
    const fontSize = Math.floor(size * 0.45);
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
      `<rect width='100%' height='100%' fill='${bgColor}' rx='${Math.floor(w/2)}' ry='${Math.floor(h/2)}'/>` +
      `<text x='50%' y='50%' dy='0.36em' font-family='Poppins, Arial, sans-serif' text-anchor='middle' fill='#ffffff' font-size='${fontSize}' font-weight='700'>${initials}</text>` +
      `</svg>`;

    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  // ========================================
  // PART 2: INITIALIZE STORAGE
  // ========================================

  if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", JSON.stringify([]));
  }

  // ========================================
  // DEMO POSTS (WITH REAL IMAGES)
  // ========================================
  let existingPosts = JSON.parse(localStorage.getItem("posts"));

  if (!existingPosts || existingPosts.length === 0) {
    const defaultPosts = [
      {
        id: "p3",
        user: {
          username: "Alice",
          displayName: "Alice K",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        title: "Sunset by the Lake",
        image: "images/Evening.jpg",
        description: "Golden hour by the lake. The sky looked unreal today 🌅",
        likes: 3,
        liked_by: ["rahul_singh", "sakshi"],
        saved_by: [],
        comments: [
          {
            id: "c1",
            user: "john_smith",
            displayName: "John Smith",
            text: "This looks peaceful!",
            replies: [],
          },
        ],
        created_at: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "p2",
        user: {
          username: "john_smith",
          displayName: "John Smith",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        title: "Morning Coffee Ritual",
        image: "images/Coffee.jpg",
        description: "Nothing beats a strong coffee to start the day ☕",
        likes: 5,
        liked_by: ["rahul_singh"],
        saved_by: [],
        comments: [],
        created_at: Date.now() - 1000 * 60 * 60 * 3,
      },
      {
        id: "p1",
        user: {
          username: "sakshi",
          displayName: "Sakshi P",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        title: "Lamborghini Urus",
        image: "images/Urus.jpg",
        description: "Best car of Lamborghini till date",
        likes: 8,
        liked_by: ["rahul_singh", "sakshi"],
        saved_by: [],
        comments: [],
        created_at: Date.now() - 1000 * 60 * 30,
      },
    ];

    localStorage.setItem("posts", JSON.stringify(defaultPosts));
  }

  // ========================================
  // PART 3: FETCH CURRENT USER DATA FROM USERS ARRAY
  // ========================================

  const loggedInUsername = loggedInUserData.name;

  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = allUsers.find((u) => u.username === loggedInUsername);
  if (!currentUser) {
    alert("User data not found. Please log in again.");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("sessionId");
    window.location.href = "login.html";
    return;
  }

  // ========================================
  // PART 4: NAVIGATION SETUP
  // ========================================

  $("#btnCreate").on("click", function () {
    window.location.href = "create.html";
  });

  $("#btnCreateMobile").attr("href", "create.html");

  // ========================================
  // PART 5: VARIABLES & INITIAL PAGE SETUP
  // ========================================

  const $feed = $("#feed");

  let posts = JSON.parse(localStorage.getItem("posts"));

  const initials = getInitials(currentUser.name);
  const avatarColor = getAvatarColor(currentUser.name);

  const $navAvatar = $("#navAvatar");
  if ($navAvatar.is('img')) {
    const avatarUrl = currentUser.avatar && currentUser.avatar.trim();
    if (avatarUrl) {
      $navAvatar.attr('src', avatarUrl).attr('alt', currentUser.name || 'avatar');
    } else {
      $navAvatar.attr('src', makeInitialsSVG(currentUser.name, avatarColor, 42)).attr('alt', currentUser.name || 'avatar');
    }
  } else {
    $navAvatar
      .css({
        "background-color": avatarColor,
        color: "white",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "font-weight": "bold",
        "font-size": "16px",
      })
      .text(initials);
  }

  $("#navName").text(currentUser.name);
  $("#navHandle").text("@" + currentUser.username);

  // ========================================
  // PART 6: FUNCTION - PROTECT TEXT CONTENT
  // ========================================
  function escapeHtml(textContent) {
    // Return empty string if no text given
    if (!textContent) return "";

    // Replace dangerous characters
    return textContent.replace(/[&<>"']/g, function (character) {
      const safeCharacters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return safeCharacters[character];
    });
  }

  // ========================================
  // PART 6: FUNCTION - DISPLAY ALL POSTS
  // ========================================

  function renderFeed() {
    posts = JSON.parse(localStorage.getItem("posts")) || [];

    $feed.empty();

    const sortedPosts = posts
      .slice()
      .sort((a, b) => b.created_at - a.created_at);

    if (sortedPosts.length === 0) {
      $feed.html(`
        <div class="text-center py-5" style="grid-column: 1 / -1;">
          <div style="color: #94a3b8; margin-bottom: 16px;">
            <i class="bi bi-inbox" style="font-size: 3rem; display: block; margin-bottom: 12px;"></i>
          </div>
          <p style="color: #e6eef6; font-size: 18px; font-weight: 600; margin-bottom: 8px;">No posts yet</p>
          <p style="color: #94a3b8; margin-bottom: 20px;">Be the first to create a post!</p>
          <a href="Instagram/create.html" class="btn btn-primary" style="background: linear-gradient(135deg, #0ea5a4, #06b6d4); border: 0; padding: 10px 28px; border-radius: 8px;">
            <i class="bi bi-plus-circle me-2"></i>Create Post
          </a>
        </div>
      `);
      return;
    }

    sortedPosts.forEach((post) => {
      const authorDisplay = post.user && (post.user.displayName || post.user.username) ? (post.user.displayName || post.user.username) : 'User';
      const authorAvatarUrl = post.user && post.user.avatar && post.user.avatar.trim();
      const avatarSrc = authorAvatarUrl ? authorAvatarUrl : makeInitialsSVG(authorDisplay, getAvatarColor(authorDisplay), 42);

      const liked = (post.liked_by || []).includes(currentUser.username);

      const saved = (post.saved_by || []).includes(loggedInUsername);

      // Owner actions only
      const ownerActions = isOwner(post) ? `
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-three-dots"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item btn-edit-post" href="#" data-id="${post.id}"><i class="bi bi-pencil me-2"></i>Edit</a></li>
            <li><a class="dropdown-item text-danger btn-delete-post" href="#" data-id="${post.id}"><i class="bi bi-trash me-2"></i>Delete</a></li>
          </ul>
        </div>
      ` : "";

      const postHTML = `
        <div class="post-card">
          <!-- POST HEADER: User info and Follow button -->
          <div class="post-header">
            <div class="post-meta">
              <img src="${avatarSrc}" alt="${post.user.displayName || post.user.username}" class="avatar">
              <div class="user-info">
                <div class="name">${escapeHtml(post.user.displayName)}</div>
                <div class="handle">@${escapeHtml(post.user.username)}</div>
              </div>
            </div>
            <button class="post-menu btn-follow" data-username="${post.user.username}" style="border: none; background: transparent; color: #0ea5a4; font-weight: 600; padding: 6px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.2s ease;">
              Follow
            </button>
          </div>

          <!-- POST IMAGE -->
          <img src="${post.image}" class="post-image" alt="post image">

          <!-- POST BODY -->
          <div class="post-body">

            <!-- ACTION BUTTONS: Like, Comment, Share, Save -->
            <div class="action-row">
              <div class="left-actions mt-0">
                <!-- Like Button -->
                <button class="action-btn btn-like" data-id="${post.id}" title="Like">
                  <i class="bi ${liked ? "bi-heart-fill" : "bi-heart"}"></i>
                  <span class="like-count">${post.likes || 0}</span>
                </button>
                
                <!-- Comment Button -->
                <button class="action-btn btn-comment" data-id="${post.id}" title="Comment">
                  <i class="bi bi-chat me-1"></i> 
                  <span class="comment-count">${(post.comments || []).length}</span>
                </button>

                <!-- Share Button -->
                <button class="action-btn btn-share" data-id="${post.id}" title="Share">
                  <i class="bi bi-send"></i>
                </button>

                <!-- Save/Bookmark Button -->
                <button class="action-btn btn-save" data-id="${post.id}" title="Save" style="margin-left: auto;">
                  <i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i>
                </button>
              </div>
            </div>

            <!-- POST TITLE AND DESCRIPTION -->
            <div class="post-title">${escapeHtml(post.title)}<span class="post-description ms-2">${escapeHtml(post.description)}</span></div>

            <!-- POST STATS -->
            <div class="post-stats">
              <span><strong>${post.likes || 0}</strong> likes</span>
              <span><strong>${(post.comments || []).length}</strong> comments</span>
            </div>
          </div>
        </div>
      `;

      $feed.append(postHTML);
    });
  }

  // ========================================
  // PART 7: LIKE FEATURE
  // ========================================


  $feed.on("click", ".btn-like", function () {
    const postId = $(this).data("id");

    let allPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // Find this specific post
    const postIndex = allPosts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    // Get the post object
    const post = allPosts[postIndex];
    post.liked_by = post.liked_by || []; // Create array if doesn't exist

    // Get the heart icon and like count elements
    const heartIcon = $(this).find("i");
    const countDisplay = $(this).siblings(".like-count");

    // Check if current user already liked this post
    if (post.liked_by.includes(currentUser.username)) {
      // UNLIKE: Remove user from liked_by list
      post.liked_by = post.liked_by.filter((u) => u !== currentUser.username);
      post.likes = Math.max(0, post.likes - 1);

      // Change icon to empty heart
      heartIcon.removeClass("bi-heart-fill text-danger").addClass("bi-heart");
    } else {
      // LIKE: Add user to liked_by list
      post.liked_by.push(currentUser.username);
      post.likes += 1;

      // Change icon to filled heart
      heartIcon.removeClass("bi-heart").addClass("bi-heart-fill text-danger");
    }

    // Update the like count displayed on the button
    countDisplay.text(post.likes);

    // Also update the likes shown in the post stats section
    const postCard = $(this).closest('.post-card');
    postCard.find('.post-stats strong').first().text(post.likes);

    // Save changes to storage
    localStorage.setItem("posts", JSON.stringify(allPosts));
  });

  // ========================================
  // PART 8: FOLLOW FEATURE
  // ========================================

  // When a follow button is clicked, toggle follow/following text
  $feed.on("click", ".btn-follow", function () {
    const followButton = $(this);

    // Toggle between Follow and Following
    if (followButton.text() === "Follow") {
      followButton.text("Following");
    } else {
      followButton.text("Follow");
    }
  });

  // ========================================
  // PART 9: SAVE/BOOKMARK FEATURE
  // ========================================

  // When a save button is clicked, toggle save icon
  $feed.on("click", ".btn-save", function () {
    // Get the bookmark icon
    const bookmarkIcon = $(this).find("i");

    // Toggle between saved and unsaved icon
    if (bookmarkIcon.hasClass("bi-bookmark-fill")) {
      // Change to empty bookmark
      bookmarkIcon
        .removeClass("bi-bookmark-fill text-primary")
        .addClass("bi-bookmark");
    } else {
      // Change to filled bookmark
      bookmarkIcon
        .removeClass("bi-bookmark")
        .addClass("bi-bookmark-fill text-primary");
    }
  });

  // ========================================
  // PART 10: SHARE FEATURE
  // ========================================

  // Setup the share toast message
  const shareToast = new bootstrap.Toast($("#shareToast"));

  // When a share button is clicked, show a message
  $feed.on("click", ".btn-share", function () {
    // Show toast notification (simulating copying a link to clipboard)
    shareToast.show();
  });

  // ========================================
  // PART 11: COMMENTS SYSTEM SETUP
  // ========================================

  // Variable to track which post's comments we're viewing
  let activePostId = null;

  // Get references to the modal and its containers
  const commentModal = new bootstrap.Modal($("#commentModal"));
  const commentsDisplay = $("#commentsContainer");
  const modalPostInfo = $("#modalPostPreview");

  // ========================================
  // PART 12: OPEN COMMENTS MODAL
  // ========================================

  // When comment button is clicked, open the comments window
  $feed.on("click", ".btn-comment", function () {
    // Get the ID of the post being commented on
    activePostId = $(this).data("id");

    // Show the comments for this post
    showCommentsWindow(activePostId);
  });

  // Function: Open and display the comments modal
  function showCommentsWindow(postId) {
    // Get all posts from storage
    posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Find the post with this ID
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Show a preview of the post at the top of the modal
    const previewAuthor = post.user && (post.user.displayName || post.user.username) ? (post.user.displayName || post.user.username) : 'User';
    const previewAvatarUrl = post.user && post.user.avatar && post.user.avatar.trim();
    const previewAvatarSrc = previewAvatarUrl ? previewAvatarUrl : makeInitialsSVG(previewAuthor, getAvatarColor(previewAuthor), 48);

    const previewHTML = `
      <div class="d-flex align-items-start gap-3">
        <img src="${previewAvatarSrc}" class="rounded-circle" width="48" height="48">
        <div>
          <div class="fw-semibold">
            ${escapeHtml(post.user.displayName)} 
            <span class="small text-secondary">@${escapeHtml(post.user.username)}</span>
          </div>
          <div class="small text-secondary">${escapeHtml(post.title)}</div>
        </div>
      </div>
    `;
    modalPostInfo.html(previewHTML);

    // Display all comments for this post
    showAllComments(post);

    // Show the modal window
    commentModal.show();
  }

  // ========================================
  // PART 13: DISPLAY COMMENTS AND REPLIES
  // ========================================

  // Function: Recursively build HTML for a comment and its nested replies
  function buildCommentHTML(comment, level = 0) {
    // Get user display name from current user or post author
    let displayName = comment.displayName || comment.user;

    const commentHTML = `
      <div class="comment-item" data-comment-id="${comment.id}" style="margin-left: ${level * 30}px;">
        <div class="d-flex gap-2 align-items-start">
          <!-- User Avatar -->
          <div class="comment-avatar rounded-circle flex-shrink-0" style="min-width: 32px; width: 32px; height: 32px; background-color: ${getAvatarColor(displayName)}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">
            ${getInitials(displayName)}
          </div>
          
          <!-- Comment Content -->
          <div class="flex-grow-1">
            <div class="comment-body p-2" style="background: #f0f2f5; border-radius: 8px;">
              <div class="small"><strong>${escapeHtml(displayName)}</strong></div>
              <div class="small mt-1">${escapeHtml(comment.text)}</div>
            </div>
            
            <!-- Reply Button -->
            <div class="mt-1">
              <button class="btn btn-sm btn-link p-0 btn-reply-nested" data-comment-id="${comment.id}" data-level="${level}">
                <small>Reply</small>
              </button>
            </div>
            
            <!-- Reply Input Box (Hidden by default) -->
            <div class="reply-input-container d-none mt-2" data-comment-id="${comment.id}">
              <div class="input-group input-group-sm">
                <input class="form-control reply-text-nested" placeholder="Write a reply...">
                <button class="btn btn-primary btn-sm btn-submit-reply-nested">Reply</button>
                <button class="btn btn-light btn-sm btn-cancel-reply">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Nested Replies Container -->
        <div class="nested-replies mt-2"></div>
      </div>
    `;

    const commentElement = $(commentHTML);

    // Recursively add nested replies
    const nestedRepliesContainer = commentElement.find(".nested-replies");
    (comment.replies || []).forEach((reply) => {
      nestedRepliesContainer.append(buildCommentHTML(reply, level + 1));
    });

    return commentElement;
  }

  // Function: Show all comments and their replies for a post
  function showAllComments(post) {
    // Clear the comments container first
    commentsDisplay.empty();

    // Loop through each top-level comment on the post
    (post.comments || []).forEach((comment) => {
      // Add the comment and all its nested replies to the display
      commentsDisplay.append(buildCommentHTML(comment));
    });
  }

  // ========================================
  // PART 14: ADD NEW COMMENT & NESTED REPLIES
  // ========================================

  // Variable to track which comment we're replying to (null if adding top-level comment)
  let selectedReplyTargetId = null;

  // When the "Add Comment" button is clicked
  $("#addCommentBtn").on("click", function () {
    // Get the text the user typed in the comment input
    const commentText = $("#newCommentInput").val().trim();

    // Check if the comment is empty
    if (!commentText) {
      // Show error message
      $("#commentError").text("Comment cannot be empty.");
      return;
    }

    // Clear any previous error message
    $("#commentError").text("");

    // Get all posts from storage
    posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Find the post we're commenting on
    const postIndex = posts.findIndex((p) => p.id === activePostId);
    if (postIndex === -1) return; // Exit if post not found

    // Create a new comment object
    const newComment = {
      id: "c" + Date.now(),
      user: currentUser.username,
      displayName: currentUser.name, // or currentUser.displayName if your users array uses that field
      text: commentText,
      replies: [],
    };

    // Make sure the post has a comments array
    posts[postIndex].comments = posts[postIndex].comments || [];

    // Add the new comment to the post
    posts[postIndex].comments.push(newComment);

    // Save the updated posts to storage
    localStorage.setItem("posts", JSON.stringify(posts));

    // Clear the comment input field
    $("#newCommentInput").val("");

    // Refresh the comments display
    showAllComments(posts[postIndex]);

    // Refresh the feed to update comment counts
    renderFeed();
  });

  // ========================================
  // PART 15: NESTED REPLY SYSTEM
  // ========================================

  // When a "Reply" button is clicked on any comment/reply
  commentsDisplay.on("click", ".btn-reply-nested", function () {
    // Get the comment ID and level we're replying to
    const commentId = $(this).data("comment-id");

    // Hide all other reply input boxes first
    commentsDisplay.find(".reply-input-container").addClass("d-none");

    // Show the reply input box for this specific comment
    commentsDisplay
      .find(`[data-comment-id="${commentId}"] .reply-input-container`)
      .removeClass("d-none");

    // Focus on the reply input field
    commentsDisplay
      .find(`[data-comment-id="${commentId}"] .reply-text-nested`)
      .focus();
  });

  // When "Cancel" button is clicked in reply box
  commentsDisplay.on("click", ".btn-cancel-reply", function () {
    // Hide the reply input box
    $(this).closest(".reply-input-container").addClass("d-none");
    // Clear the reply text
    $(this)
      .closest(".reply-input-container")
      .find(".reply-text-nested")
      .val("");
  });

  // Helper function: Find a comment by ID recursively
  function findCommentById(comments, commentId) {
    for (let comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      // Recursively search in replies
      const found = findCommentById(comment.replies || [], commentId);
      if (found) return found;
    }
    return null;
  }

  // When the "Reply" button in a reply box is clicked
  commentsDisplay.on("click", ".btn-submit-reply-nested", function () {
    // Get the reply text
    const replyInputBox = $(this).closest(".reply-input-container");
    const replyText = replyInputBox.find(".reply-text-nested").val().trim();

    // Exit if reply is empty
    if (!replyText) return;

    // Get the comment ID we're replying to
    const commentId = replyInputBox.data("comment-id");

    // Get all posts from storage
    posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Find the post we're working with
    const postIndex = posts.findIndex((p) => p.id === activePostId);
    if (postIndex === -1) return; // Exit if post not found

    // Find the comment we're replying to (could be nested at any level)
    const targetComment = findCommentById(
      posts[postIndex].comments || [],
      commentId,
    );
    if (!targetComment) return; // Exit if comment not found

    // Create a new reply object
    const newReply = {
      id: "r" + Date.now(),
      user: currentUser.username,
      displayName: currentUser.name,
      text: replyText,
      replies: [],
    };

    // Make sure the target comment has a replies array
    if (!targetComment.replies) {
      targetComment.replies = [];
    }

    // Add the new reply to the target comment
    targetComment.replies.push(newReply);

    // Save the updated posts to storage
    localStorage.setItem("posts", JSON.stringify(posts));

    // Refresh the comments display
    showAllComments(posts[postIndex]);

    // Refresh the feed to update comment counts
    renderFeed();
  });

  // ========================================
  // PART 16: OWNERSHIP RULE & POST - EDIT DELETE
  // ========================================

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // you already set this
  const sessionId = localStorage.getItem("sessionId");
  const currentUsername = loggedInUser?.name; // you stored `name` as username in login script

  function isOwner(post) {
    return post?.user?.username === currentUsername;
  }

  // Bootstrap modal instance for edit
  const editPostModal = new bootstrap.Modal($("#editPostModal"));

  // Delegated: open edit modal
  $feed.on("click", ".btn-edit-post", function (e) {
    e.preventDefault();
    const postId = $(this).data("id");
    const all = JSON.parse(localStorage.getItem("posts")) || [];
    const post = all.find((p) => p.id === postId);
    if (!post) return;

    // Ownership guard (double-check)
    if (post?.user?.username !== currentUser.username) return;

    // Prefill
    $("#editPostId").val(postId);
    $("#editPostTitle").val(post.title || "");
    $("#editPostDesc").val(post.description || "");
    $("#editTitleError").text("");
    $("#editDescError").text("");

    editPostModal.show();
  });

  // Save changes
  $("#savePostChanges").on("click", function () {
    const id = $("#editPostId").val();
    const title = ($("#editPostTitle").val() || "").trim();
    const desc = ($("#editPostDesc").val() || "").trim();
    let ok = true;

    if (title.length < 2) {
      $("#editTitleError").text("Title must be at least 2 characters");
      ok = false;
    } else $("#editTitleError").text("");

    if (desc.length < 2) {
      $("#editDescError").text("Description must be at least 2 characters");
      ok = false;
    } else $("#editDescError").text("");

    if (!ok) return;

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return;

    // Ownership guard
    if (posts[idx]?.user?.username !== currentUser.username) return;

    posts[idx].title = title;
    posts[idx].description = desc;

    localStorage.setItem("posts", JSON.stringify(posts));

    editPostModal.hide();
    renderFeed(); // refresh the feed UI
  });

  // Delegated: delete with confirm (SweetAlert if available)
  $feed.on("click", ".btn-delete-post", function (e) {
    e.preventDefault();
    const postId = $(this).data("id");

    const proceed = () => {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      // Ownership guard
      if (post?.user?.username !== currentUser.username) return;

      posts = posts.filter((p) => p.id !== postId);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderFeed();
    };

    if (window.Swal && typeof Swal.fire === "function") {
      Swal.fire({
        title: "Delete this post?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#d33",
      }).then((res) => {
        if (res.isConfirmed) proceed();
      });
    } else {
      if (confirm("Delete this post? This cannot be undone.")) proceed();
    }
  });

  // ========================================
  // PART 17: REFRESH FEED
  // ========================================

  // When refresh button is clicked, reload the feed
  $("#refreshFeed").on("click", function () {
    renderFeed();
  });

  // ========================================
  // PART 18: SIDEBAR TOGGLE
  // ========================================

  // Toggle sidebar on hamburger click
  $("#toggleSidebar").on("click", function () {
    $("#sidebar").toggleClass("open");
  });

  // Close sidebar on close button click
  $("#sidebarClose").on("click", function () {
    $("#sidebar").removeClass("open");
  });

  // Close sidebar when clicking on a nav link
  $(".sidebar .nav-link").on("click", function () {
    $("#sidebar").removeClass("open");
  });

  // ========================================
  // PART 19: LOAD THE FEED ON PAGE START
  // ========================================

  // Show the feed when the page first loads
  renderFeed();
});

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.User;
import com.fgm.flow.core.Post;
import com.fgm.flow.core.Comment;
import com.fgm.flow.core.QComment;
import com.fgm.flow.core.Membership;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.PostRegistry;
import com.fgm.flow.dao.CommentRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.net.URI;
import java.util.List;
import java.util.ArrayList;
import static java.lang.System.out;
import javax.ejb.EJB;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.*;
import java.util.Date;
import java.util.Comparator;
import static java.util.Collections.sort;
import static com.fgm.flow.service.TestingStatusSupplier.TESTING_DISABLED;
import java.io.Serializable;

/**
 *
 * @author fgm
 */
@Path("comment")
public class CommentResource {

    //private static final Logger LOG = Logger.getLogger(UserResource.class.getName());
    @Context
    private UriInfo uriInfo;

    @EJB
    private UserRegistry userReg;
    @EJB
    private CommentRegistry cmntReg;
    @EJB
    private PostRegistry postReg;
    @EJB
    private MembershipRegistry memshipReg;
    private final Gson gson = new Gson();

    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();

    
    public static class GetData
    {
        public Integer userid;
        public Integer ownerid;
        public Integer postid;
        public String nick;
        public Integer id;
        public String text;
        public Date before;
        public Date after;
        public Integer count;
    }

    public static class GetDataOut
    {
        public Integer ownerid;
        public Integer postid;
        public Integer id;
        public String nick;
        public String text;
        public Date time;
    
        public GetDataOut(Comment comment)
        {
            this.ownerid = comment.getCommenter().getId();
            this.postid = comment.getPost().getId();
            this.id = comment.getId();
            this.nick = comment.getCommenter().getNick();
            this.text = comment.getText();
            this.time = comment.getTime();
        }
    }
        
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData inData)
    {
        // Most GetData fields are ignored currently
        
        if(inData.postid == null || inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        Post post =  postReg.find(inData.postid);
        User user = userReg.find(inData.userid);
        
        if(post == null || user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        if(!user.isMemberOfGroup(post.getUserGroup()))
        {
             return Response.status(UNAUTHORIZED).build();           
        }
        
        List<GetDataOut> getDataOutList = new ArrayList<>();
        
        for(Comment comment : post.getComments())
        {
            if(comment.getStatus() == 1)
            {
                comment.setText("Hidden");
            }
            
            getDataOutList.add(new GetDataOut(comment));
        }
        
        sort(getDataOutList, new GDOComparator());
        
        return Response.ok(gson.toJson(getDataOutList)).build();
    }
    
    private class GDOComparator implements Comparator<GetDataOut>
    {
        @Override
        public int compare(GetDataOut lGDO, GetDataOut rGDO)
        {
            // Order inverted by switch of lPost and rPost
            return  rGDO.time.compareTo(lGDO.time);
        }
    }
    
    public static class PutData
    {
        public Integer userid;
        public Integer id;
        public String text;
        public String status;
    }

    public static class PutDataOut
    {
        public Integer ownerid;
        public Integer postid;
        public Integer id;
        public String nick;
        public String text;
        public Date time;
    
        public PutDataOut(Comment comment)
        {
            this.ownerid = comment.getCommenter().getId();
            this.postid = comment.getPost().getId();
            this.id = comment.getId();
            this.nick = comment.getCommenter().getNick();
            this.text = comment.getText();
            this.time = comment.getTime();
        }
    }
    
    @POST
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequest(PutData inData)
    {
        // Most PutData fields are ignored
        
        if(inData.id == null || inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        Comment comment =  cmntReg.find(inData.id);
        User user = userReg.find(inData.userid);
        
        if(comment == null || user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        if(!comment.getCommenter().equals(user))
        {
             return Response.status(UNAUTHORIZED).build();           
        }
        
        if(inData.status != null)
        {
            switch(inData.status.toLowerCase())
            {
                case "hidden":
                comment.setStatus(1);
                cmntReg.update(comment);
                break;
                case "visible":
                comment.setStatus(0);
                cmntReg.update(comment);
                break;
                default:
                return Response.status(BAD_REQUEST).build();
            }
        }
         
        return Response.ok(gson.toJson(new PutDataOut(comment))).build();
    }
    
    public static class PostData
    {
        public Integer userid;
        public Integer postid;
        public String text;
        public String status;
    }

    public static class PostDataOut
    {
        public Integer ownerid;
        public Integer postid;
        public Integer id;
        public String nick;
        public String text;
        public Date time;
    
        public PostDataOut(Comment comment)
        {
            this.ownerid = comment.getCommenter().getId();
            this.postid = comment.getPost().getId();
            this.id = comment.getId();
            this.nick = comment.getCommenter().getNick();
            this.text = comment.getText();
            this.time = comment.getTime();
        }
    }
    
    @POST
    @Path("post")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response postRequest(PostData inData)
    {
        if(inData.userid == null || inData.userid == null
                || inData.text == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        Post post = postReg.find(inData.postid);
        User user = userReg.find(inData.userid);

        // Check that the post and commenter exist
        if(post == null ||  user == null)
        {
            return Response.status(NOT_FOUND).build();
        }

        // Check if the user is a member of the group that the post
        // the user wants to comment is associated with
        if(!user.isMemberOfGroup(post.getUserGroup()))
        {
             return Response.status(UNAUTHORIZED).build();           
        }
        
        Comment comment = new Comment(inData.text, post, user);

        cmntReg.create(comment);

        return Response.ok(gson.toJson(new PostDataOut(comment))).build();
    }
    
    
    
    
    
    
    
    
    
    @POST
    @Path("create")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response create(
            @FormParam("text") String text,
            @FormParam("postId") int postId,
            @FormParam("commenterId") int commenterId,
            @FormParam("status") int status
    ) 
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        Post post = postReg.find(postId);
        User commenter = userReg.find(commenterId);

        // Check that the post and commenter exist
        if(post != null && commenter != null)
        {
            // Fetch possible membership that the commenter and the posts
            // associated group is part of
            Membership membership = memshipReg.find(
                    new Membership.MembershipId(
                            commenterId, post.getUserGroup().getId()));
            // Check if the membership exists and has owner or 
            // active member status
            if(membership != null
                && (membership.getStatus() == 0 || membership.getStatus() == 1)
            )
            {
        
                Comment comment = new Comment(text, post, commenter, status);

                cmntReg.create(comment);

                URI commentUri = uriInfo
                        .getAbsolutePathBuilder()
                        .path(String.valueOf(comment.getId()))
                        .build(comment);

                return Response.created(commentUri).build();
            }
        }

        return Response.status(403).build();

    }

    @POST
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON})
    public Response findForId(@FormParam("postId") int postId) 
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        JPAQueryFactory qf = new JPAQueryFactory(cmntReg.getEntityManager());
        QComment comment = QComment.comment;
        Post post = postReg.find(postId);
        List<Comment> commentsOnPost = new ArrayList<>();

        // Check if the post exists
        if(post != null)
        {
            commentsOnPost = qf.select(comment)
                .from(comment)
                .where(comment.post.eq(post))
                .fetch();
        }
        else
        {
            // Return 400 Bad request if the post doesn't exist
            return Response.status(400).build();
        }

        List<ResponseComment> commentsOnPostFormatted = new ArrayList<>(commentsOnPost.size());
        
        for(Comment cmnt : commentsOnPost)
        {
            commentsOnPostFormatted.add(new ResponseComment(cmnt));
        }

        return Response.ok(gson.toJson(commentsOnPostFormatted)).build();
    }

    private class ResponseComment
    {
        private final int id;
        private final String nick;
        private final String text;
        private final int status;
        private final Date time;

        public ResponseComment(Comment comment)
        {
            this.id = comment.getId();
            this.nick = comment.getCommenter().getNick();
            this.text = comment.getText();
            this.status = comment.getStatus();
            this.time = comment.getTime();
        }
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        List<Comment> comments = cmntReg.findAll();

        return Response.ok(gsonEWE.toJson(comments)).build();
    }
}

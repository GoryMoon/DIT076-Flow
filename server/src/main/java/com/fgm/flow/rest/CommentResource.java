/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.User;
import com.fgm.flow.core.Post;
import com.fgm.flow.core.Comment;
import com.fgm.flow.core.Membership;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.PostRegistry;
import com.fgm.flow.dao.CommentRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.List;
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

                post.addComment(comment);

                URI commentUri = uriInfo
                        .getAbsolutePathBuilder()
                        .path(String.valueOf(comment.getId()))
                        .build(comment);

                return Response.created(commentUri).build();
            }
        }
    

        return Response.status(403).build();
        
    }
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {        
        List<Comment> comments = cmntReg.findAll();
        
        return Response.ok(gsonEWE.toJson(comments)).build();
    }
}

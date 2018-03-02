/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.Post;
import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import com.fgm.flow.core.Membership;
import com.fgm.flow.dao.PostRegistry;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.UserGroupRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.List;
import static java.lang.System.out;
import static java.lang.System.err;
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
@Path("post")
public class PostResource {

    //private static final Logger LOG = Logger.getLogger(UserResource.class.getName());

    @Context
    private UriInfo uriInfo;

    @EJB
    private PostRegistry postReg;
    @EJB
    private UserRegistry userReg;
    @EJB
    private UserGroupRegistry uGroupReg;
    @EJB
    private MembershipRegistry memshipReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();

    /*
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public Response create(Post post)
    {
        post.timeStamp();
        
        User poster = postReg.find(post.getPoster());
        product.setUser(user);
        
        
        postReg.create(post);

        // Respond with status 'ok' and only the ID if the
        // nick did not already exist
        return Response.ok().build();
    }
    */
    
    @POST
    @Path("create")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response create(
            @FormParam("title") String title,
            @FormParam("text") String text,
            @FormParam("usergroupId") int userGroupId,
            @FormParam("posterId") int posterId
        ) 
    {
        //User poster = userReg.find(posterId);
        //UserGroup userGroup = uGroupReg.find(userGroupId);
        
                    
        Membership membership = 
                memshipReg.find(new Membership.MembershipId(posterId, userGroupId));
        
        if(membership != null 
                && (membership.getStatus() == 0 || membership.getStatus() == 1))
        {
           // UserGroup userGroup = uGroupsWithName.get(0);

            User poster = userReg.find(posterId);
            UserGroup userGroup = uGroupReg.find(userGroupId);
            
            Post post = new Post(title, text, userGroup, poster);

            postReg.create(post);
                
            poster.addPost(post);
            
            //poster.addUserGroup(userGroup);
        
            URI postUri = uriInfo
                    .getAbsolutePathBuilder()
                    .path(String.valueOf(post.getId()))
                    .build(post);
            
            return Response.created(postUri).build();

        }
        
        return Response.status(403).build();
        
    }
   
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {        
        List<Post> posts = postReg.findAll();
        
        return Response.ok(gsonEWE.toJson(posts)).build();
    }
}

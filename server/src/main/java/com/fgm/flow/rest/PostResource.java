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
import com.fgm.flow.core.HiddenPost;
import com.fgm.flow.core.HiddenPost.HiddenPostId;
import com.fgm.flow.dao.PostRegistry;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.UserGroupRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import com.fgm.flow.dao.HiddenPostRegistry;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import static java.util.Collections.sort;
import java.util.Comparator;
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
import static javax.ws.rs.core.Response.Status.*;
import static com.fgm.flow.service.TestingStatusSupplier.TESTING_DISABLED;

/**
 * A flow post
 * 
 * @author fgm
 */
@Path("post")
public class PostResource
{   
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
    @EJB
    private HiddenPostRegistry hidePostReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();
    
    public static class GetData // 3.1 Compliant
    {
        public Integer userid;
        public Integer ownerid;
        public Integer groupid;
        public String nick;
        public Integer id;
        public String title;
        public String text;
        public Date before;
        public Date after;
        public Integer count;
    }
    
    public static class GetDataOut // 3.1 Compliant
    {
        public Integer ownerid;
        public Integer groupid;
        public Integer id;
        public String nick;
        public String group;
        public String title;
        public String text;
        public Date time;
    
        public GetDataOut(Post post)
        {
            this.ownerid = post.getPoster().getId();
            this.groupid = post.getUserGroup().getId();
            this.id = post.getId();
            this.nick = post.getPoster().getNick();
            this.group = post.getUserGroup().getName();
            this.title = post.getTitle();
            this.text = post.getText();
            this.time = post.getTime();            
        }
    }

    // For retrieving posts
    @POST
    @Path("get")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(GetData inData)
    {
        // Most GetData fields are currentlty ignored 
        
        if(inData.userid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        
        // Return status 'not found' if user does not exist
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        List<GetDataOut> getDataOutList = new ArrayList<>();
        
        // Get posts for all groups the user is an owner of active member of
        if(inData.groupid == null)
        {
            for(Membership memship : user.getMemberships())
            {
                if(memship.getStatus() == 0 || memship.getStatus() == 1)
                {
                    for(Post post : memship.getUserGroup().getPosts())
                    {
                        // Add the post to the list to return if the post isn't
                        // hidden, is posted after a given after date and
                        // is posted before a given before date
                        if(postIsRequested(user, post, inData))
                        {
                            getDataOutList.add(new GetDataOut(post));
                        }
                    }
                }
            }
        }
        else
        {           
            UserGroup userGroup = uGroupReg.find(inData.groupid);
            if(userGroup == null)
            {
                return Response.status(NOT_FOUND).build();
            }
            
            if(!user.isMemberOfGroup(userGroup))
            {
                return Response.status(UNAUTHORIZED).build();
            }
            for(Post post : userGroup.getPosts())
            {
                if(postIsRequested(user, post, inData))
                {
                    getDataOutList.add(new GetDataOut(post));
                }
            }
        }

        // Newest post first
        sort(getDataOutList, new GDOComparator());
        
        int lSize = getDataOutList.size();
        
        // Reduce the number of posts in the list if count is given and the number
        // of posts is greater than count
        if(inData.count != null && lSize > inData.count)
        {
            // Negative count is not allowed
            if(inData.count < 0)
            {
                return Response.status(BAD_REQUEST).build();
            }
            
            // If only after is given up to count number of the oldest posts are
            // retained, otherwise up to count number of the newest
            if(inData.after != null && inData.before == null)
            {
                getDataOutList = getDataOutList.subList(lSize - inData.count, lSize);
            }
            else
            {
                getDataOutList = getDataOutList.subList(0, inData.count);
            }
        }

        return Response.ok(gson.toJson(getDataOutList)).build();
    }
    
    // Checks that the post isn't hidden, is posted after a given after date
    // and is posted before a given before date
    private boolean postIsRequested(User user, Post post, GetData inData)
    {        
        return !user.isHidingPost(post)
                            && (inData.after == null || 
                                post.getTime().after(inData.after))
                            && (inData.before == null ||
                                post.getTime().before(inData.before));
    }
    
    public static class PostData // 3.1 Compliant
    {
        public Integer userid;
        public Integer groupid;
        public String title;
        public String text;
        public Integer status;
    }
    
    public static class PostDataOut // 3.1 Compliant
    {
        public Integer ownerid;
        public Integer groupid;
        public Integer id;
        public String nick;
        public String group;    // name of group
        public String title;
        public String text;
        public Date time;
    
        PostDataOut(Post post)
        {
            this.ownerid = post.getPoster().getId();
            this.groupid = post.getUserGroup().getId();
            this.id = post.getId();
            this.nick = post.getPoster().getNick();
            this.group = post.getUserGroup().getName();
            this.title = post.getTitle();
            this.text = post.getText();
            this.time = post.getTime(); 
        }
    }
    
    // For creating posts
    @POST
    @Path("post")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getRequest(PostData inData)
    {
        if(inData.userid == null || inData.groupid == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        
        if(user == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        UserGroup userGroup = uGroupReg.find(inData.groupid);
        
        
        if(!user.isMemberOfGroup(userGroup))
        {
             return Response.status(UNAUTHORIZED).build();           
        }

        Post post = new Post(inData.title, inData.text, userGroup, user);

        postReg.create(post);

        return Response.ok(gson.toJson(new PostDataOut(post))).build();
    }


    public static class PutData // 3.1 Compliant
    {
        public Integer userid;
        public Integer id;
        public String title;
        public String text;
        public Integer status;
    }
    
    public static class PutDataOut // 3.1 Compliant
    {
        public Integer ownerid;
        public Integer groupid;
        public Integer id;
        public String nick;
        public String group;
        public String title;
        public String text;
        public Date time;
    
        public PutDataOut(Post post) // 3.1 Compliant
        {
            this.ownerid = post.getPoster().getId();
            this.groupid = post.getUserGroup().getId();
            this.id = post.getId();
            this.nick = post.getPoster().getNick();
            this.group = post.getUserGroup().getName();
            this.title = post.getTitle();
            this.text = post.getText();
            this.time = post.getTime();            
        }
    }
    
    // Only for hiding posts currently, could be expanded to updating posts
    @PUT
    @Path("put")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response putRequest(PutData inData)
    {
        // Most PutData fields are ignored currently
        
        // Respond with status 'bad request' if userid or (post) id haven't
        // been supplied
        if(inData.userid == null || inData.id == null)
        {
            return Response.status(BAD_REQUEST).build();
        }
        
        User user = userReg.find(inData.userid);
        Post post = postReg.find(inData.id);
        
        // Respond with status 'not found' if user or post corresponding to
        // supplied id:s do not exist
        if(user == null || post == null)
        {
            return Response.status(NOT_FOUND).build();
        }
        
        // A given status is interpreted as a request for changing the user's
        // hiddenPost relationship to the given post
        if(inData.status != null)
        {
            // Not allowed to change relationship between user and a post
            // if the user is not member of the group that the post
            // is associated with - WS responds with status 'bad request' if
            // such a request is made. Might be a more fitting error response,
            // but is it all that important? 
            if(!user.isMemberOfGroup(post.getUserGroup()))
            {
                return Response.status(BAD_REQUEST).build();
            }
            
            HiddenPostId hiddenPostId = new HiddenPostId(inData.userid, inData.id);
            
            switch(inData.status)
            {
                case 1:
                // Do nothing if the hidden relationship between the user 
                // and the post exist already
                if(hidePostReg.find(hiddenPostId) == null)
                {
                    hidePostReg.create(new HiddenPost(user, post));   
                }
                break;
                case 0:
                // Do nothing if it is already the case that the hidden
                // relationship between the user and the post does not exist
                if(hidePostReg.find(hiddenPostId) != null)
                {
                    hidePostReg.delete(new HiddenPostId(inData.userid, inData.id));
                }
                break;
                default:
                return Response.status(BAD_REQUEST).build();
            }
        }
        
        return Response.ok(gson.toJson(new PutDataOut(post))).build();
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
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
                    
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
        
            URI postUri = uriInfo
                    .getAbsolutePathBuilder()
                    .path(String.valueOf(post.getId()))
                    .build(post);
            
            return Response.created(postUri).build();

        }
        
        return Response.status(403).build();
        
    }

    /*
    @POST
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPostsForUser(@FormParam("userId") int userId) 
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        User user = userReg.find(userId);
        
        // Return bad request 400 if user does not exist
        if(user == null)
        {
            return Response.status(400).build();
        }
        
        List<Post> posts = new ArrayList<>();
        
        for(Membership memship : user.getMemberships())
        {
            for(Post post : memship.getUserGroup().getPosts())
            {
                posts.add(post);
            }
        }
        
        sort(posts, new postComparator());
        
        return Response.ok(gsonEWE.toJson(posts)).build();
    }
    */

    /*
    @POST
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPostsForUserFromCount(
            @FormParam("userId") int userId,
            @FormParam("from") Date from,
            @FormParam("count") int count
    ) 
    {   
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        User user = userReg.find(userId);
        
        // Return bad request 400 if user does not exist
        if(user == null)
        {
            return Response.status(400).build();
        }
        
        List<Post> posts = new ArrayList<>();
        
        for(Membership memship : user.getMemberships())
        {
            for(Post post : memship.getUserGroup().getPosts())
            {
                posts.add(post);
            }
        }


        
        sort(posts, new postComparator());

        return Response.ok(gsonEWE.toJson(posts)).build();
    }

    
    private class postComparator implements Comparator<Post>
    {
        @Override
        public int compare(Post lPost, Post rPost)
        {
            // Order inverted by switch of lPost and rPost
            return rPost.getTime().compareTo(lPost.getTime());
        }
    }
    */
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        List<Post> posts = postReg.findAll();
        
        return Response.ok(gsonEWE.toJson(posts)).build();
    }
}
